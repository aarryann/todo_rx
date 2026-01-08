export let activeEffect = null

export function effect1(source, run, {defer = true} = {}) {
  let init = true;
  const runner = (...args) => {
    console.log(`Registering effect ${source} = ${init} = ${defer}`);
    activeEffect = runner;
    const value = source; // auto-track
    activeEffect = null;
    if (!(defer && init)) {
      run(...args, value);
    }
    init = false;
  };

  runner();
}

export function effect(run) {
  console.log(`Registering effect 2`);
  activeEffect = run;
  run();
  activeEffect = null;

}
