#!/usr/bin/env python3
"""
Test du format des données de l'API bibliothèque
"""
import requests
import json

def test_library_format():
    print("🧪 Test du format des données de l'API bibliothèque")
    
    try:
        # Test de l'endpoint books
        print("\n1. Test /api/library/books/")
        r = requests.get('http://localhost:8000/api/library/books/', timeout=10)
        print(f"Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            print(f"Type de données: {type(data)}")
            print(f"Clés disponibles: {list(data.keys()) if isinstance(data, dict) else 'N/A'}")
            
            if isinstance(data, dict) and 'results' in data:
                books = data['results']
                print(f"Nombre de livres: {len(books)}")
                if books:
                    print(f"Premier livre: {json.dumps(books[0], indent=2, ensure_ascii=False)}")
            elif isinstance(data, list):
                print(f"Nombre de livres (liste directe): {len(data)}")
                if data:
                    print(f"Premier livre: {json.dumps(data[0], indent=2, ensure_ascii=False)}")
        
        # Test de l'endpoint categories
        print("\n2. Test /api/library/categories/")
        r = requests.get('http://localhost:8000/api/library/categories/', timeout=10)
        print(f"Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            print(f"Type de données: {type(data)}")
            print(f"Nombre de catégories: {len(data) if isinstance(data, list) else 'N/A'}")
            if isinstance(data, list) and data:
                print(f"Première catégorie: {json.dumps(data[0], indent=2, ensure_ascii=False)}")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_library_format()
