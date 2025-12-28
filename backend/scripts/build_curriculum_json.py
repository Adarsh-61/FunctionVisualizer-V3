import json
import os
import re
import glob

# Constants
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))
OUTPUT_FILE = os.path.join(PROJECT_ROOT, "frontend", "src", "data", "curriculum.json")
GRAPH_CONFIGS_FILE = os.path.join(BASE_DIR, "graph_configs.json")
CURATED_EXAMPLES_FILE = os.path.join(BASE_DIR, "curated_examples.json")

CLASS_FOLDERS = ["Class9", "Class10", "Class11", "Class12"]

def load_auxiliary_data():
    """Loads graph configs and curated examples safely."""
    graphs = {}
    examples = {}
    
    if os.path.exists(GRAPH_CONFIGS_FILE):
        try:
            with open(GRAPH_CONFIGS_FILE, 'r', encoding='utf-8') as f:
                graphs = json.load(f)
            print("  [+] Loaded graph configurations.")
        except Exception as e:
            print(f"  [!] Failed to load graph configs: {e}")
            
    if os.path.exists(CURATED_EXAMPLES_FILE):
        try:
            with open(CURATED_EXAMPLES_FILE, 'r', encoding='utf-8') as f:
                examples = json.load(f)
            print("  [+] Loaded curated examples.")
        except Exception as e:
            print(f"  [!] Failed to load curated examples: {e}")
            
    return graphs, examples

def get_chapter_number(chapter_id):
    """
    Extracts integer chapter number from ID or Key.
    Supports formats:
    - 'ch_1_number_systems' -> 1
    - '11_1', '12_10' -> 1, 10
    - 'ch_10_conic_sections_parabola' -> 10
    """
    # Explicit 'ch_X'
    match_ch = re.search(r'ch_(\d+)', chapter_id)
    if match_ch:
        return int(match_ch.group(1))
    
    # 'Class_Chapter' format (12_10)
    match_num = re.match(r'^\d+_(\d+)$', chapter_id)
    if match_num:
        return int(match_num.group(1))
        
    return 9999

def map_aux_data(class_id, aux_data):
    """
    Transforms aux_data[class_id] (dict of string keys) 
    into a map of {chapter_number: data_object}.
    """
    mapped = {}
    if class_id not in aux_data:
        return mapped
        
    for key, data in aux_data[class_id].items():
        c_num = get_chapter_number(key)
        if c_num != 9999:
            # Handle multiple entries for same chapter (e.g., conic sections has ch_10_parabola, ch_10_ellipse)
            if c_num not in mapped:
                mapped[c_num] = []
            mapped[c_num].append(data)
            
    return mapped

def sort_chapters_numerically(chapters):
    return sorted(chapters, key=lambda x: get_chapter_number(x["id"]))

def build_curriculum():
    print("Starting Advanced NCERT Curriculum Build...")
    print(f"Target Output: {OUTPUT_FILE}")
    
    aux_graphs, aux_examples = load_auxiliary_data()
    final_curriculum = {}

    for folder_name in CLASS_FOLDERS:
        class_path = os.path.join(BASE_DIR, folder_name)
        if not os.path.exists(class_path):
            print(f"Warning: Folder {folder_name} not found. Skipping.")
            continue

        print(f"Processing {folder_name}...")
        
        # Determine normalized class_id (e.g. "class_9")
        # Folder is Class9 -> class_9
        normalized_class_id = folder_name.lower().replace("class", "class_")
        
        # Prepare Aux Maps for this class
        class_graphs_map = map_aux_data(normalized_class_id, aux_graphs)
        class_examples_map = map_aux_data(normalized_class_id, aux_examples)
        
        all_chapters = []
        
        # Temporary storage to merge Schema A structure
        current_class_metadata = {"id": normalized_class_id, "title": f"Class {folder_name.replace('Class', '')}"}

        json_files = glob.glob(os.path.join(class_path, "*.json"))
        
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                    found_chapters = []
                    
                    # Schema Type A: Wrapper Object (Class 9, 10)
                    if "chapters" in data:
                        current_class_metadata["id"] = data.get("id", current_class_metadata["id"])
                        current_class_metadata["title"] = data.get("title", current_class_metadata["title"])
                        found_chapters.extend(data["chapters"])
                    
                    # Schema Type B: Direct Chapter Object (Class 11, 12)
                    else:
                        if "id" in data and "topics" in data:
                            found_chapters.append(data)
                    
                    # ENHANCEMENT: Merge Aux Data into Chapters
                    for ch in found_chapters:
                        c_num = get_chapter_number(ch["id"])
                        
                        # 0. Structural Normalization (Class 11/12)
                        # Enforce "Ch X: Title" and "X.Y Topic Title"
                        if normalized_class_id in ["class_11", "class_12"]:
                             if not ch["title"].startswith(f"Ch {c_num}:"):
                                  ch["title"] = f"Ch {c_num}: {ch['title']}"
                             
                             if "topics" in ch:
                                  for idx, topic in enumerate(ch["topics"]):
                                       topic_num_str = f"{c_num}.{idx+1}"
                                       if not topic["title"].strip().startswith(topic_num_str):
                                            topic["title"] = f"{topic_num_str} {topic['title']}"

                        # 1. Merge Graphs
                        if c_num in class_graphs_map:
                            # class_graphs_map[c_num] is a LIST of graph configs (e.g. parabola, circle)
                            # We merge them. If chapter has no 'sections' we might just add to 'topics' or 'graph_config'
                            # For simplicity, we add a 'graphs' property to the chapter.
                            # Or better: check if title matches? No, reliance on number is safer.
                            
                            # Flatten the list of graph configs
                            merged_functions = []
                            ranges = None
                             
                            for g_cfg in class_graphs_map[c_num]:
                                if "functions" in g_cfg:
                                    merged_functions.extend(g_cfg["functions"])
                                    # Take the range from the first valid config
                                    if not ranges and "xRange" in g_cfg:
                                        ranges = {"xRange": g_cfg["xRange"], "yRange": g_cfg["yRange"]}
                            
                            if merged_functions and "topics" in ch and len(ch["topics"]) > 0:
                                # Inject Graph Config into the FIRST topic (Introduction) by default
                                ch["topics"][0]["graph_config"] = {
                                    "functions": merged_functions,
                                    "title": ch["title"] + " Graphs"
                                }
                                if ranges:
                                    ch["topics"][0]["graph_config"].update(ranges)
                        
                        # 2. Merge Examples
                        if c_num in class_examples_map:
                            # class_examples_map contains lists of examples.
                            if "examples" not in ch:
                                ch["examples"] = []
                            
                            existing_ids = {ex.get("id") for ex in ch["examples"]}
                            
                            for ex_group in class_examples_map[c_num]:
                                # ex_group might be a list of examples (Schema: ch_key: [ex1, ex2])
                                # Wait, map_aux_data wraps in list. So ex_group IS the list of examples?
                                # Let's check curated_examples.json structure.
                                # "ch_1": [ {id, question...} ]
                                # map_aux_data stores: { 1: [ [ex1, ex2] ] } if only one key mapped to 1.
                                # If two keys mapped to 1 (rare), { 1: [[ex1], [ex2]] }
                                
                                # So ex_group is a list of example objects
                                if isinstance(ex_group, list):
                                    for ex in ex_group:
                                        if ex.get("id") not in existing_ids:
                                            ch["examples"].append(ex)
                                            existing_ids.add(ex.get("id"))
                                elif isinstance(ex_group, dict):
                                    # Just in case
                                    if ex_group.get("id") not in existing_ids:
                                        ch["examples"].append(ex_group)

                    all_chapters.extend(found_chapters)

            except Exception as e:
                print(f"  Error reading {json_file}: {e}")
                continue

        if all_chapters:
            all_chapters = sort_chapters_numerically(all_chapters)
            
            final_curriculum[current_class_metadata["id"]] = {
                "id": current_class_metadata["id"],
                "title": current_class_metadata["title"],
                "chapters": all_chapters
            }
            print(f"  > Processed {len(all_chapters)} chapters for {folder_name} (with Enhancements).")
        else:
            print(f"  > No valid data found for {folder_name}.")


    # Solver Mapping (Class -> Chapter Number -> Solver ID)
    SOLVER_MAP = {
        "class_9": {
            1: "solver_number_systems",
            2: "solver_polynomials",
            3: "solver_coordinate_geometry",
            4: "solver_linear_equations",
            5: "solver_geometry",
            6: "solver_geometry",
            7: "solver_geometry",
            8: "solver_quadrilaterals",
            9: "solver_circles",
            10: "solver_circles", # Construction?
            11: "solver_mensuration", # Heron
            12: "solver_mensuration", # Surface Area
            13: "solver_statistics",
            14: "solver_probability"
        },
        "class_10": {
            1: "solver_number_systems",
            2: "solver_polynomials",
            3: "solver_linear_equations",
            4: "solver_algebra", # Quadratic
            5: "solver_algebra", # AP
            6: "solver_geometry", # Triangle
            7: "solver_coordinate_geometry",
            8: "solver_trigonometry",
            9: "solver_trigonometry",
            10: "solver_circles",
            11: "solver_geometry",
            12: "solver_mensuration",
            13: "solver_mensuration",
            14: "solver_statistics",
            15: "solver_probability"
        },
        "class_11": {
            1: "solver_sets",
            2: "solver_algebra", # Relations
            3: "solver_trigonometry",
            4: "solver_algebra", # PMI
            5: "solver_algebra", # Complex
            6: "solver_linear_equations", # Inequalities
            7: "solver_algebra", # PnA
            8: "solver_algebra", # Binomial
            9: "solver_algebra", # SeqSer
            10: "solver_coordinate_geometry", # Lines
            11: "solver_coordinate_geometry", # Conics
            12: "solver_3d_geometry",
            13: "solver_calculus", # Limits
            14: "solver_statistics", # Reasoning (Ch14 is Math Reasoning usually?) Wait, Ch15 is Stats.
            15: "solver_statistics", 
            16: "solver_probability"
        },
        "class_12": {
            1: "solver_sets",
            2: "solver_trigonometry",
            3: "solver_matrices",
            4: "solver_matrices",
            5: "solver_calculus",
            6: "solver_calculus",
            7: "solver_calculus", 
            8: "solver_calculus",
            9: "solver_calculus",
            10: "solver_vectors",
            11: "solver_3d_geometry",
            12: "solver_linear_equations",
            13: "solver_probability"
        }
    }

    # Write Output
    print("Writing Enhanced curriculum.json...")
    
    # Final pass to inject solverId
    for class_id, class_data in final_curriculum.items():
        if class_id in SOLVER_MAP:
            for ch in class_data["chapters"]:
                c_num = get_chapter_number(ch["id"])
                if c_num in SOLVER_MAP[class_id] and "topics" in ch:
                    assigned_solver = SOLVER_MAP[class_id][c_num]
                    for topic in ch["topics"]:
                        topic["solverId"] = assigned_solver

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_curriculum, f, indent=2, ensure_ascii=False)
    
    print("Build Complete.")

if __name__ == "__main__":
    build_curriculum()
