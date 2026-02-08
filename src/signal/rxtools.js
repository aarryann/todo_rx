  let seen = new WeakSet();

  export let isConnected = false;
  export let jsonData = {};
  export let isPowerMode = false;

  export function setState(newState) {
    jsonData = newState;
  }

  function isSignal(obj) {
    return obj && (obj.__isSignal || obj.__isSignalArray);
  }

  function unwrapSignal(obj) {
    return isSignal(obj) ? obj.value : obj;
  }

  function unwrapDeep(obj, seen = new WeakSet()) {
    if (obj && typeof obj === 'object') {
      if (seen.has(obj)) return obj; // prevent circular recursion
      seen.add(obj);
    }

    if (isSignal(obj)) return unwrapDeep(obj.value, seen);
    if (Array.isArray(obj)) return obj.map(item => unwrapDeep(item, seen));
    if (obj && typeof obj === 'object') {
      const res = {};
      for (const k in obj) {
        res[k] = unwrapDeep(obj[k], seen);
      }
      return res;
    }
    return obj;
  }

  function createToggle(onToggle) {
    const span = document.createElement('span');
    span.className = 'toggle';
    span.textContent = '▼';
    span.onclick = (e) => {
      e.stopPropagation();
      span.classList.toggle('rotated');
      onToggle();
    };
    return span;
  }

  function createIcon(text, onclick) {
    const el = document.createElement('span');
    el.className = 'icon';
    el.textContent = text;
    el.onclick = (e) => { e.stopPropagation(); onclick(); };
    return el;
  }

  function addControls(row, parentObj, key, isObject) {
    const controls = document.createElement('div');
    controls.className = 'controls';

    if (!isObject) {
      controls.appendChild(createIcon('✎', () => toggleEdit(row, parentObj, key)));
    }

    controls.appendChild(createIcon('+', () => {
      const target = parentObj[key];
      if (Array.isArray(unwrapSignal(target))) {
        const template = unwrapSignal(target)[0] ? createDeepTemplate(unwrapSignal(target)[0]) : "New Item";
        unwrapSignal(target).push(template);
      } else if (typeof target === 'object' && target !== null) {
        const newKey = prompt("Enter property name:");
        if (newKey) target[newKey] = "value";
      }
      refresh();
    }));

    controls.appendChild(createIcon('×', () => {
      const target = parentObj[key];
      if (Array.isArray(unwrapSignal(parentObj))) {
        unwrapSignal(parentObj).splice(key, 1);
      } else {
        delete parentObj[key];
      }
      refresh();
    }));

    row.appendChild(controls);
  }

  function toggleEdit(row, parentObj, key) {
    const valSpan = row.querySelector('.value');
    valSpan.contentEditable = true;
    valSpan.classList.add('editable');
    valSpan.focus();
    valSpan.onblur = () => {
      const newValue = valSpan.textContent.replace(/"/g, '');
      if (isSignal(parentObj[key])) {
        parentObj[key].value = newValue;
      } else {
        parentObj[key] = newValue;
      }
      valSpan.contentEditable = false;
      valSpan.classList.remove('editable');
    };
  }

  function createDeepTemplate(source) {
    if (Array.isArray(source)) return source.length ? [createDeepTemplate(source[0])] : [];
    if (source && typeof source === 'object') {
      const template = {};
      for (let k in source) template[k] = createDeepTemplate(source[k]);
      return template;
    }
    if (typeof source === 'number') return 0;
    if (typeof source === 'boolean') return false;
    return "New Value";
  }

  export function renderTree(obj, container) {
    const unwrappedObj = unwrapSignal(obj);
    if (seen.has(unwrappedObj)) return;
    seen.add(unwrappedObj);

    container.innerHTML = '';
    const source = unwrapDeep(obj);

    for (let key in source) {
      if (['__owner','__key','__isReactive','__isSignal','__isSignalArray','trackers','scheduler'].includes(key)) continue;

      const raw = source[key];
      const value = unwrapSignal(raw);
      const isArray = Array.isArray(value);
      const isObject = typeof value === 'object' && value !== null;

      const row = document.createElement('div');
      row.className = 'tree-row';

      let branchContainer = null;
      if (isObject || isArray) {
        branchContainer = document.createElement('div');
        branchContainer.className = 'tree-level';
        const toggle = createToggle(() => branchContainer.classList.toggle('collapsed'));
        row.appendChild(toggle);
      } else {
        const spacer = document.createElement('span');
        spacer.style.width = '18px';
        row.appendChild(spacer);
      }

      const keySpan = document.createElement('span');
      keySpan.className = 'key';
      keySpan.textContent = Array.isArray(obj) ? `[${key}]:` : `${key}:`;
      row.appendChild(keySpan);

      if (!isObject && !isArray) {
        const valSpan = document.createElement('span');
        valSpan.className = 'value';
        valSpan.textContent = `"${value}"`;
        row.appendChild(valSpan);
      }

      container.appendChild(row);
      addControls(row, obj, key, isObject || isArray);

      if (branchContainer) {
        renderTree(raw, branchContainer);
        container.appendChild(branchContainer);
      }
    }
  }
  // Refresh function
  export function refresh() {
    renderTree(jsonData, document.getElementById('editor'));
  }

  /**
   * The 'Subscription Method' that the Container effectively calls
   */
  export function reload(newData) {
    seen = new WeakSet();
    jsonData = newData;
    refresh();
  }

  export function attemptSubscription() {
    if (isConnected) return;
    window.parent.postMessage({ type: 'SUBSCRIBE_ME' }, "*");
    setTimeout(attemptSubscription, 500);
  }

