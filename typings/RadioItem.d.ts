type RadioItem = {
  id: string;
  name: string;
  streamUrl: string;
  frequency: number;
  address: string;
  province: number;
};

type RadioStore = {
  current: RadioItem | null;
  setCurrent: (radio: RadioItem) => void;
};