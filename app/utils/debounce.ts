const debounce = (fn: () => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};

export default debounce;
