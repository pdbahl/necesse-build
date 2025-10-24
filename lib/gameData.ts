export const weapons = [
  "Wood Sword",
  "Copper Sword",
  "Iron Sword",
  "Nunchucks",
  "Gold Sword",
  "Katana",
  "Frost Sword",
  "Ivy Sword" ,
  "Demonic Sword",
  "Tungsten Sword",
  "Spider Claw",
  "Reinforced Katana",
  "Amethyst Sword",
  "Sand Knife",
  "Cutlass",
  "Bark Blade",
  "Venom Slasher",
  "Aged Champion Sword",
  "Antique Sword",
  "Caustic Executioner",
  "Gemstone Longsword",
  "Iron Greatsword",
  "Frost Greatsword",
  "Ivy Greatsword",
  "Quartz Greatsword",
  "Glacial Greatsword",
  "Slime Greatsword",
  "Ravenwing Greatsword",
  "Necrotic Greatsword",
  "Wood Spear",
  "Copper Spear",
  "Copper Pitchfork",
  "Iron Spear",
  "Gold Spear",
  "Frost Spear",
  "Demonic Spear",
  "Ivy Spear",
  "Void Spear",
  "Tungsten Spear",
  "Vultures Talon",
  "Cryo Spear",
  "Ravenbeak Spear",
  "Gold Glaive",
  "Frost Glaive",
  "Quartz Glaive",
  "Slime Glaive",
  "Cryo Glaive",
  "Wood Boomerang",
  "Tungsten Boomerang",
  "Spider Boomerang",
  "Frost Boomerang",
  "Rolling Pin",
  "Void Boomerang",
  "Razor Blade",
  "Night Razor",
  "Glacial Boomerang",
  "Butcher's Cleaver",
  "Dragons Rebound",
  "Heavy Hammer",
  "Boxing Glove Gun",
  "Lightning Hammer",
  "Carapace Dagger",
  "Galvanic Hammer",
  "Dryad Greathammer",
  "Brute's Battleaxe",
  "Reaper Scythe",
  "Blood Claw",
  "Anchor & Chain",
  "Chef's Special",
  "Void Claw" 
  ] as const;

export const trinkets = [
  
] as const;

export const armorSets = [
  "",
] as const;

export type Weapon = typeof weapons[number];
export type Trinket = typeof trinkets[number];
export type ArmorSet = typeof armorSets[number];

export interface Build {
  id: string;
  weapon: Weapon;
  trinket: Trinket;
  armor: ArmorSet;
  createdAt: string;
}
