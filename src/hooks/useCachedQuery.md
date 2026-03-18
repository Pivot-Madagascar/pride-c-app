# useCachedQuery

Hook unifié pour la gestion des requêtes avec cache (Redux Store + Navigateur).

## Installation

Ce hook est inclus dans le projet et ne nécessite aucune installation supplémentaire.

```javascript
import { useCachedQuery } from './hooks/useCachedQuery.js'
```

## Description

`useCachedQuery` gère le caching des données de deux manières :
1. **Redux Store** - Stocke les données dans le state global de l'application
2. **Cache API du navigateur** - Utilise l'API Cache pour persister les données

### Ordre de priorité

1. Données du Redux Store (si déjà cached)
2. Données du cache navigateur
3. Requête API (si aucune donnée en cache)

## Utilisation

### Exemple basique

```javascript
import { useCachedQuery } from './hooks/useCachedQuery.js'
import { useExecuteQuery } from './hooks/useExecuteQuery.js'

const MyComponent = () => {
    const { execute } = useExecuteQuery()
    
    const { data, loading, error, isCached, fetchData } = useCachedQuery({
        queryKey: JSON.stringify({ resource: 'organisationUnitLevels' }),
        query: {
            orgUnitLevels: {
                resource: 'organisationUnitLevels',
                params: { fields: 'id,name,level' }
            }
        },
        selector: (state) => state.orgUnit.orgUnitLevels,
        storageKey: '/organisationUnitLevels'
    })

    useEffect(() => {
        fetchData(null, execute)
    }, [fetchData, execute])

    if (loading) return <div>Chargement...</div>
    if (error) return <div>Erreur: {error.message}</div>

    return <div>Données: {JSON.stringify(data)}</div>
}
```

## Paramètres

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `queryKey` | string | Oui | Clé unique pour identifier la requête en cache |
| `query` | object | Oui | Requête DHIS2 au format app-runtime |
| `selector` | function | Oui | Fonction selector Redux pour récupérer les données stockées |
| `storageKey` | string | Non | Clé pour le cache navigateur |

## Valeurs de retour

| Propriété | Type | Description |
|-----------|------|-------------|
| `data` | any | Les données retournées (du cache ou de l'API) |
| `loading` | boolean | État de chargement |
| `error` | Error | Erreur éventuelle |
| `isCached` | boolean | Indique si les données sont en cache |
| `fetchData` | function | Fonction pour récupérer les données |
| `clearCache` | function | Fonction pour effacer le cache |
| `isStale` | function | Fonction pour vérifier si les données sont obsolètes |

## Méthodes

### fetchData(engine, executeFn)

Récupère les données en suivant l'ordre de priorité :
1. Vérifie le Redux Store
2. Vérifie le cache navigateur
3. Appelle l'API si nécessaire

```javascript
await fetchData(null, execute)
```

### clearCache()

Efface le cache pour cette requête :
- Supprime la clé de `cachedDimensions` dans Redux
- Supprime les données du cache navigateur

```javascript
clearCache()
```

### isStale()

Vérifie si les données sont obsolètes (à implémenter avec timestamps).

```javascript
if (isStale()) {
    // Rafraîchir les données
}
```

## Intégration avec useExecuteQuery

Ce hook fonctionne parfaitement avec `useExecuteQuery` :

```javascript
import { useCachedQuery } from './useCachedQuery.js'
import { useExecuteQuery } from './useExecuteQuery.js'

const { execute } = useExecuteQuery()

const { data, loading } = useCachedQuery({
    queryKey: 'my-query-key',
    query: { /* ... */ },
    selector: (state) => state.mySlice.data,
    storageKey: '/my-data'
})

// Dans un useEffect
useEffect(() => {
    fetchData(null, execute)
}, [execute])
```

## Comparaison avec l'ancienne méthode

### Avant (sans useCachedQuery)

```javascript
const useOrgUnitLevels = () => {
    const engine = useDataEngine()
    const dispatch = useDispatch()
    
    const [orgUnitLevels, setOrgUnitLevels] = useState([])
    const [loading, setLoading] = useState(true)
    
    const cachedDimensions = useSelector((state) => state.app.fetchedDimensions)
    const storedOrgUnitLevels = useSelector((state) => state.orgUnit.orgUnitLevels)

    useEffect(() => {
        const query = { /* ... */ }
        const key = JSON.stringify(query)
        const isStored = cachedDimensions.includes(key)

        if (!isStored) {
            // Fetch from API
            const result = await engine.query(query)
            setOrgUnitLevels(result.orgUnitLevels.organisationUnitLevels)
            dispatch(setFetchedDimensions(key))
        } else {
            setOrgUnitLevels(storedOrgUnitLevels)
        }
    }, [engine])

    return { loading, orgUnitLevels }
}
```

### Après (avec useCachedQuery)

```javascript
import { useCachedQuery } from './useCachedQuery.js'
import { useExecuteQuery } from './useExecuteQuery.js'

const useOrgUnitLevels = () => {
    const { execute } = useExecuteQuery()
    
    const query = {
        orgUnitLevels: {
            resource: 'organisationUnitLevels',
            params: { fields: 'id,name,level' }
        }
    }
    
    const { data, loading, fetchData } = useCachedQuery({
        queryKey: JSON.stringify(query),
        query,
        selector: (state) => state.orgUnit.orgUnitLevels,
        storageKey: '/organisationUnitLevels'
    })

    useEffect(() => {
        fetchData(null, execute)
    }, [fetchData, execute])

    return { loading, orgUnitLevels: data }
}
```

## Gestion des erreurs

Le hook gère automatiquement les erreurs et les expose via la propriété `error` :

```javascript
const { error } = useCachedQuery({ /* params */ })

if (error) {
    console.error('Erreur de chargement:', error.message)
}
```

## Notes

- Le hook utilise `useCallback` pour mémoriser les fonctions et éviter les re-rendus inutiles
- Le cache navigateur utilise l'API Cache avec le nom `pride-c-cache`
- Les données Redux sont persistées via le système de cache de l'application
