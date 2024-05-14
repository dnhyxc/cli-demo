import { createContext, useContext } from "react";
import addMobx from "./counter";

class RootStore {
  add = addMobx;

  detail = detailMobx;

  create = createMobx;
}

const store = new RootStore();

const Context = createContext(store);

export default function useStore() {
  return useContext(Context);
}
