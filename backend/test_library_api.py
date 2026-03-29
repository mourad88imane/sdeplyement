#!/usr/bin/env python3
"""
Test de l'API de la bibliothèque
"""
import requests
import json

def test_library_api():
    print("🧪 Test de l'API de la bibliothèque")
    
    try:
        r = requests.get('http://localhost:8000/api/library/books/', timeout=10)
        print(f"Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            print(f"✅ API fonctionne!")
            print(f"📚 Nombre de livres: {len(data.get('results', []))}")
            
            for i, book in enumerate(data.get('results', [])[:3]):
                print(f"{i+1}. {book.get('title', 'Titre inconnu')}")
                print(f"   Auteur(s): {book.get('authors_list', 'Inconnu')}")
                print(f"   Catégorie: {book.get('category_name', 'Inconnue')}")
                print(f"   Disponible: {book.get('copies_available', 0)}/{book.get('copies_total', 0)}")
                print()
        else:
            print(f"❌ Erreur {r.status_code}")
            print(f"Response: {r.text[:200]}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_library_api()
