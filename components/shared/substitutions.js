const SUB_MAP = [
  {
    match: /jalapeñ|jalapeno|serrano/i,
    options: [
      'Serrano pepper (hotter)',
      'Fresno pepper (similar heat)',
      'Poblano (milder, dice small)',
      'Green bell pepper + pinch chili flakes (mild)'
    ]
  },
  {
    match: /tomato/i,
    options: [
      'Roma tomatoes',
      'Cherry/grape tomatoes (halve/quarter)',
      'Canned diced tomatoes, drained (last resort)'
    ]
  },
  {
    match: /cilantro/i,
    options: [
      'Flat-leaf parsley',
      'Green onion tops',
      'Mint + parsley mix'
    ]
  },
  {
    match: /onion/i,
    options: [
      'Red onion',
      'Yellow onion',
      'Shallot',
      'Green onions (scallions)'
    ]
  },
  {
    match: /lime/i,
    options: [
      'Lemon juice',
      'Orange + splash vinegar',
      'Apple cider vinegar (lighter)'
    ]
  },
  {
    match: /salt/i,
    options: [
      'Kosher salt',
      'Sea salt',
      'Soy sauce + reduce volume (adds umami)'
    ]
  },
  {
    match: /pepper/i,
    options: [
      'Red chili flakes (start small)',
      'Hot sauce (few dashes)',
      'Smoked paprika (smoky, mild)'
    ]
  }
];

export function suggestSubs(name = '') {
  const match = SUB_MAP.find(entry => entry.match.test(name));
  if (match) return match.options;
  return [];
}
