### Manual Tests

## 1. Open the HTML file.

For example, create this pair if you don't already have one.

`test.html`

```
<form rx:data="defaultDataset">
  <h1 rx:text="board.count"></h1>
</form>
```

`test.data.js`

```
export default {
  schema: {
    board: {
      count: "number"
    }
  }
};
```

## **2. Trigger synchronization**

Use the synchronization command you registered in the extension.

Open the Command Palette:

- macOS: `Cmd + Shift + P`
- Windows/Linux: `Ctrl + Shift + P`

Search for your Microrx synchronization command (likely **Microrx: Synchronize Schema**).

If you don't remember its exact name, inspect `package.json` under `contributes.commands`.

You should initially get a successful synchronization with no parser errors.

## **3. Test each parser failure**

For each test, modify `test.data.js`, save it, open `test.html`, and run synchronization again.

### **Test A — Spread property**

Replace the data file with:

```
const commonFields = {
  count: "number"
};

export default {
  schema: {
    board: {
      ...commonFields,
      active: "boolean"
    }
  }
};
```

Expected:

-

  Pass

  &#x20;Parser diagnostic appears in Problems.

- No changes to `test.data.js`.

- No changes to `microrx.lock.json`.

### **Test B — Invalid primitive**

```
export default {
  schema: {
    board: {
      count: "currency"
    }
  }
};
```

Expected: diagnostic identifying unsupported primitive `"currency"`. No file or lock changes.

### **Test C — Computed property**

```
const fieldName = "count";

export default {
  schema: {
    board: {
      [fieldName]: "number"
    }
  }
};
```

Expected: diagnostic identifying unsupported field name.

### **Test D — Syntax error**

```
export default {
  schema: {
    board: {
      count: "number"
    }
  // Missing closing braces
```

Expected: TypeScript syntax diagnostic. No rewrite.

### **Test E — Missing schema property**

```
export default {
  dataset: {},
  load() {
    return {};
  }
};
```

Expected: diagnostic saying the default export is missing the `schema` property.

### **Test F — Unsupported field initializer**

```
export default {
  schema: {
    board: {
      count: getCountType()
    }
  }
};
```

Expected: unsupported initializer diagnostic.

## **4. Verify the actual safety behavior**

For each failure, check three things:

| Check                  | Expected     |
| ---------------------- | ------------ |
| `.data.js` contents    | Unchanged    |
| `microrx.lock.json`    | Unchanged    |
| VS Code Problems panel | Parser error |



Important

&#x20;The diagnostic should appear against `test.data.js`, not `test.html`.



Open Problems with `Cmd + Shift + M` on macOS.

## **5. Test recovery**

After testing, restore the valid file:

```
export default {
  schema: {
    board: {
      count: "number"
    }
  }
};
```

Save it and synchronize again.

Expected:

- Parser diagnostic disappears.
- Normal synchronization resumes.
- New HTML-discovered fields can be added.

## **One additional test I particularly want you to run**

This checks whether we preserve unrelated developer code.

Use:

```
const config = {
  enabled: true
};

export default {
  schema: {
    board: {
      count: "number"
    }
  },

  config,

  load() {
    return config;
  }
};
```

Then add a new field to `test.html`:

```
<p rx:text="board.name"></p>
```

Synchronize.

Expected: `name: "string"` gets added, while `config` and `load()` remain untouched.
