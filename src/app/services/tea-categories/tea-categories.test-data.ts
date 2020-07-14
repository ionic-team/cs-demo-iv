import { TeaCategory } from '../../models/tea-category';

export const testTeaCategories: Array<TeaCategory> = [
  {
    id: 1,
    name: 'Green',
    description:
      'Green teas have the oxidation process stopped very early on, leaving them with a very subtle flavor and complex undertones. ' +
      'These teas should be steeped at lower temperatures for shorter periods of time.',
  },
  {
    id: 2,
    name: 'Black',
    description:
      'A fully oxidized tea, black teas have a dark color and a full robust and pronounced flavor. ' +
      'Blad teas tend to have a higher caffeine content than other teas.',
  },
  {
    id: 3,
    name: 'Herbal',
    description:
      'Herbal infusions are not actually "tea" but are more accurately characterized as infused beverages ' +
      'consisting of various dried herbs, spices, and fruits.',
  },
  {
    id: 4,
    name: 'Oolong',
    description:
      'Oolong teas are partially oxidized, giving them a flavor that is not as robust as black teas but also not as suble as green teas. ' +
      'Oolong teas often have a flowery fragrance.',
  },
  {
    id: 5,
    name: 'Dark',
    description:
      'From the Hunan and Sichuan provinces of China, ' +
      'dark teas are flavorful aged probiotic teas that steeps up very smooth with slightly sweet notes.',
  },
  {
    id: 6,
    name: 'Puer',
    description:
      'An aged black tea from china. Puer teas have a strong rich flavor that could be described as "woody" or "peaty."',
  },
  {
    id: 7,
    name: 'White',
    description:
      'White tea is produced using very young shoots with no oxidation process. ' +
      'White tea has an extremely delicate flavor that is sweet and fragrent. ' +
      'White tea should be steeped at lower temperatures for short periods of time.',
  },
  {
    id: 8,
    name: 'Yellow',
    description:
      'A rare tea from China, yellow tea goes through a similar shortened oxidation process like green teas. ' +
      'Yellow teas, however, do not have the grassy flavor that green teas tend to have. ' +
      'The leaves often resemble the shoots of white teas, but are slightly oxidized.',
  },
];
