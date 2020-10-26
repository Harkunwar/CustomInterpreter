import { read } from '../read';

const parse = sexp => {
    if (typeof sexp === 'number') {
        return {
            type: 'NUM',
            value: [sexp],
        }
    } else if (typeof sexp === 'string') {
        return {
            type: 'ID',
            value: [sexp],
        }
    } else if (Array.isArray(sexp)) {
        const [first, ...rest] = sexp;
        switch (first) {
            case '+': return {
                type: 'ADD',
                value: [parse(rest[0]), parse(rest[1])],
            }
            case '-': return {
                type: 'SUB',
                value: [parse(rest[0]), parse(rest[1])],
            }
            case 'with': return {
                type: 'WITH',
                value: [rest[0][0], parse(rest[0][1]), parse(rest[1])]
            }
        }
    }
}

const emptyEnv = (x) => { throw new Error(`lookup failed ${x}`); }

const extendEnv = (env, x, v) => x0 => x0 === x ? v : env(x);

const lookupEnv = (env, x) => env(x);

const interpret = (wae, env = emptyEnv) => {
    const { type, value } = wae;
    switch (type) {
        case 'NUM': {
            const [num] = value;
            return num;
        }
        case 'ADD': {
            const [l, r] = value;
            return interpret(l, env) + interpret(r, env);
        }
        case 'SUB': {
            const [l, r] = value;
            return interpret(l, env) - interpret(r, env);
        }
        case 'WITH': {
            const [x, named, body] = value;
            const newEnv = extendEnv(env, x, interpret(named, env));
            return interpret(body, newEnv);
        }
        case 'ID': {
            const [x] = value;
            return lookupEnv(env, x);
        }
    }
}

export const interpFromStr = str => interpret(parse(read(str)));
