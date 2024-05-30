import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled, lighten, darken } from '@mui/system';
import * as React from 'react';

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

export default function RenderGroup() {
  const options = [
    {
      "municipality": "Maroharatra",
      "municipalityId": "v0y8WKasENm",
      "formationSanitaire": "CSB2 Maroharatra",
      "formationSanitaireId": "ZPvH8UsgwYv",
      "displayName": "Maroharatra",
      "id": "NR788pi0I3e"
    },
    {
      "municipality": "Fasintsara",
      "municipalityId": "usKgUaPXahQ",
      "formationSanitaire": "CSB2 Fasintsara",
      "formationSanitaireId": "EE6WwIMgQ0F",
      "displayName": "Tsarakianja",
      "id": "nQbP8ETTnR4"
    },
    {
      "municipality": "Ranomafana",
      "municipalityId": "zCTwJPToyHS",
      "formationSanitaire": "CSB2 Ranomafana",
      "formationSanitaireId": "r4U7PhBKR7S",
      "displayName": "Ranomafana",
      "id": "NhPMW9k508q"
    }
  ];

  const groupedOptions = options.reduce((acc, option) => {
    const key = option.municipality;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(option);
    return acc;
  }, {});

  const groupedOptionsArray = Object.keys(groupedOptions).map((municipality) => ({
    municipality,
    options: groupedOptions[municipality]
  }));

  return (
    <Autocomplete
      id="grouped-demo"
      options={groupedOptionsArray}
      groupBy={(option) => option.municipality}
      getOptionLabel={(option) => option.options.map((o) => o.displayName).join(', ')}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} />}
      renderGroup={(params) => (
        <li key={params.key}>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>
      )}
    />
  );
}
