const addComma = str => {
  const lastChar = str[str.length - 1];
  if (lastChar === '[' || lastChar === undefined) {
    return str;
  }
  return str + ',';
};

const isNum = v => !isNaN(parseFloat(v)) && isFinite(v);

export const read = str => {
    let tokens = '';
    str = str.trim();
    let s = '';
    for (let index = 0; index < str.length; index++) {
        s += str[index];
        const peek = str[index + 1];
        if (isNum(s.trim()) && !isNum(peek)) {
            tokens = addComma(tokens);
            tokens += s;
            s = ''
        }
        if (s.trim() == '{') {
            tokens = addComma(tokens);
            tokens += '[';
            s = '';
        }
        if (s.trim() == '}') {
            tokens += ']';
            s = '';
        }
        if (s!=='' && (peek === undefined || peek === ' ' || peek === '}')) {
            tokens = addComma(tokens);
            tokens += `"${s.trim()}"`;
            s = '';
        }
    }
    return JSON.parse(tokens);
}