export const weapons = [
  "Iron Sword",
  "Iron Bow",
  "Iron Spear",
  "Copper Sword",
  "Copper Bow",
  "Copper Spear",
  "Gold Sword",
  "Gold Bow",
  "Gold Spear",
  "Frost Staff",
  "Fire Staff",
  "Shadow Staff",
  "Mythril Sword",
  "Mythril Bow",
  "Adamantite Sword",
  "Adamantite Bow",
  "Tungsten Sword",
  "Tungsten Bow",
  "Demonic Sword",
  "Ancient Bow",
  "Void Staff",
  "Glacial Staff",
  "Inferno Staff",
] as const;

export const trinkets = [
  "Health Ring",
  "Mana Ring",
  "Speed Ring",
  "Strength Ring",
  "Defense Ring",
  "Critical Ring",
  "Regeneration Pendant",
  "Magic Pendant",
  "Warrior Pendant",
  "Ranger Pendant",
  "Mage Pendant",
  "Lucky Charm",
  "Vampire Amulet",
  "Phoenix Amulet",
  "Dragon Amulet",
  "Shadow Amulet",
  "Light Amulet",
  "Nature Amulet",
  "Berserker Medallion",
  "Guardian Medallion",
] as const;

export const armorSets = [
  "Leather Armor",
  "Iron Armor",
  "Copper Armor",
  "Gold Armor",
  "Mythril Armor",
  "Adamantite Armor",
  "Tungsten Armor",
  "Demonic Armor",
  "Ancient Armor",
  "Void Armor",
  "Glacial Armor",
  "Inferno Armor",
  "Shadow Armor",
  "Light Armor",
  "Dragon Armor",
  "Phoenix Armor",
  "Berserker Armor",
  "Guardian Armor",
  "Assassin Armor",
  "Wizard Robes",
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
