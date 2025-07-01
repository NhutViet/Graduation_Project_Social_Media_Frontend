import raw from './province.json';

type ProvinceRaw = {
  name_with_type: string;
  code: string;
};

export type PickerOption = { label: string; value: string };

const byCode = (a: ProvinceRaw, b: ProvinceRaw) =>
  parseInt(a.code, 10) - parseInt(b.code, 10);

export const VN_PROVINCES: PickerOption[] = Object.values(raw)
  .sort(byCode)
  .map((prov: ProvinceRaw) => ({
    label: prov.name_with_type,   
    value: prov.name_with_type,   
  }));

export const SEX = [
  {label: 'Nam', value: 'Nam'},
  {label: 'Nữ', value: 'Nữ'},
  {label: 'Không muốn come out', value: 'Không muốn come out'},
];
