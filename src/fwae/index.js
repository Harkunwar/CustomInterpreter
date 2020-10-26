import { read } from '../read';

export const parse = sexp => {
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
            case 'fun': return {
                type: 'FUN',
                value: [rest[0][0], parse(rest[1])],
            }
        }
        if (Array.isArray(first) || typeof first === 'string') {
            return {
                type: 'APP',
                value: [parse(first), parse(rest[0])]
            }
        }
    }
    throw new Error('Parse failed');
}

const emptyEnv = {}

const extendEnv = (env, x, v) => ({
    ...env,
    [x]: v,
});

const lookupEnv = (env, x) => {
    if (env[x] === undefined) {
        throw new Error(`lookup failed ${x}`);
    }
    return env[x];
};

export const interpret = (fwae, env = emptyEnv) => {
    const { type, value } = fwae;
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
            const val = interpret(named, env);
            const newEnv = extendEnv(env, x, val);
            return interpret(body, newEnv);
        }
        case 'ID': {
            const [x] = value;
            return lookupEnv(env, x);
        }
        case 'FUN': {
            const [x, body] = value;
            return {
                type: 'FUNV',
                value: [x, body, env],
            }
        }
        case 'APP': {
            const [rator, rand] = value;
            const funV = interpret(rator, env);
            const val = interpret(rand, env);
            const [x, body, funEnv] = funV.value;
            const newEnv = extendEnv(funEnv, x, val);
            return interpret(body, newEnv);
        }
    }
}

export const interpFromStr = str => interpret(parse(read(str)));
