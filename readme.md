# create-store-hook

### Usage

```ts
const useCommonData = createStoreHook({} /** initial state */);

// or
const useCommonData = createStoreHook(
  {} /** initial state */,
  service /** initial service */
);

// in FC

const [data, setData] = useCommonData();
```
