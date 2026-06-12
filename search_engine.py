import json
import os

class AeroSearch:
    def __init__(self, registry_file="fleet_registry.json"):
        # Load the dispatcher when the app starts
        self.registry_file = registry_file
        if os.path.exists(self.registry_file):
            with open(self.registry_file, 'r') as f:
                self.registry = json.load(f)
        else:
            self.registry = {}

    def find_manual_file(self, model):
        """Step 1: Look up the model in the registry to find the correct index file."""
        model = str(model).upper()
        if model in self.registry:
            # For V1, we just grab the first file associated with the model.
            # Later, you can add logic here to filter by exact Serial Number!
            return self.registry[model][0].get("file")
        return None

    def search_manual(self, model, query):
        """Step 2: Open the correct manual and search for the keywords."""
        index_file = self.find_manual_file(model)
        
        if not index_file or not os.path.exists(index_file):
            return {"error": f"No manual indexed for model {model}."}

        # Open the specific manual's map
        with open(index_file, 'r') as f:
            manual_index = json.load(f)

        results = []
        query_words = query.lower().split() # Split "wheel and tire" into words

        # Scan every heading in the manual
        for entry in manual_index:
            title = entry.get("title", "").lower()
            location = entry.get("location", "").lower()
            
            # If ALL search words are found in either the title or location
            if all(word in title or word in location for word in query_words):
                results.append({
                    "chapter": location,
                    "subject": entry.get("title"),
                    "page": entry.get("pdf_page")
                })
                
        return {"results": results}

# --- TEST THE ENGINE ---
# If you run this file directly, it will test your new search engine.
if __name__ == "__main__":
    engine = AeroSearch()
    
    print("--- Searching for Cessna 152 Wheel and Tire Assembly ---")
    response = engine.search_manual(model="152", query="wheel tire")
    
    if "error" in response:
        print(response["error"])
    else:
        for res in response["results"]:
            print(f"Chapter: {res['chapter']}")
            print(f"Subject: {res['subject']}")
            print(f"Go to PDF Page: {res['page']}\n")