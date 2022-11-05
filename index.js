export const style = document.getElementById("less-style")?.sheet || init();

function pickRandom(index) {
    const letterCase = Math.round(Math.random() * 10) & 1 ? 65 : 97
    const Atoz = letterCase + Math.round(Math.random() * 25);
    const numbers = 48 + Math.round(Math.random() * 8)

    const candidate = [...Array(8).fill(Atoz), 45, 95];
    if (index) {
        candidate.push(numbers)
        candidate.push(numbers)
        candidate.push(numbers)
    }

    const voted = candidate[Math.round(Math.random() * (candidate.length - 1))]

    return String.fromCharCode(voted)
}

const classMap = new Set();

function nameGenerator() {
    let name;
    let number = false;
    while(true){
        const chars = new Array(7).fill("");
        for (const [i, v] of chars.entries()) {
            chars[i] = pickRandom(number);
            if (chars[i].match(/[A-z]/i)) {
                number = true;
            }
        }

        let concated = chars.join("");
        if (!classMap.has(concated)){
            classMap.add(concated);
            name = concated;
            break;
        }

    }

    return name
}

function init(){
    const style = document.createElement("style");

    style.type = "text/css";
    style.id = "less-style";
    document.head.appendChild(style);

    return style.sheet;
}

export function rulesManager(rules){
    // Join the rules string with character code 3 as seperator, then replace all char code 3 into res
    // console.log(rules.join(String.fromCharCode(3)).replaceAll(String.fromCharCode(3), "Akbar"))
    // const types = rules.matchAll(/&\.([A-z_\-][A-z0-9_\-]*)/g).map(v => v[1]);

    let randomName = nameGenerator();
    let attr = randomName;

    let [declarations, extend] = parseRuleSet(rules, randomName);

    attr = [randomName, extend.with.join(" ")].join(" ").trim()

    const collection = {
        with(){
            return `${randomName} ${Array.from(arguments).join(" ")}`
        },
        props: {
            name(){
                return `.${randomName}`;
            },
            toString(){
                return attr;
            }
        }
    };

    const handler = {
        get(target, prop, receiver){
            if (typeof prop === "string") {
                if (collection.props[prop]) {
                    return collection.props[prop]();
                }

                return Reflect.get(...arguments) || `${attr} ${prop}`
            } else {
                return function(hint){return attr;};
            }
        }
    }

    /** proxy that targeting object that has toString() method  */
    return [declarations, new Proxy(collection, handler)]
}

export function toString(str, ...values){
    let ruleSet = str.join(String.fromCharCode(3));

    for (const [index, val] of values.entries()) {
        ruleSet = ruleSet.replace(String.fromCharCode(3), val)
    }

    return ruleSet;
}

function parseRuleSet(rules, name){

    let declaration = [];
    const tags = {with: ""};
    const at = /@(with) ([A-z0-9\-_ ]*)/g;
    // const reds = /(.*)(\{([A-z0-9.;:\t \n\r\-_])*\})/g;
    const reds = /(.*)(\{([^\{\}])*\})/g;

    const directive = rules.matchAll(at);
    const declares = Array.from(rules.matchAll(reds));

    declaration = declares.map(val => {
        let selector = val[1]
        .trim()
        .replace('&', name)
        .replace(/^:/g, `${name}:`);

        selector = selector.includes(name) ? selector : `${name} ${selector}`

        return `.${selector} ${val[2]}`
    })

    for (const tag of Object.keys(tags)) {
        tags[tag] = Array.from(directive).filter((val) => val[1] === tag).map(matches => matches[2])
    }

    declaration.push(`.${name} {${rules.replaceAll(at, "").replaceAll(reds, "")}}`);

    // Returns a clean rules syntax since
    // this at rules is defined not by the css or sass
    return [declaration, tags]
}

export function useCSS(rules, ...res) {
    const [declarations, proxy] = rulesManager(toString(...arguments));

    declarations.map(val => {
        // console.log(val)
        style.insertRule(val)
    })
    return proxy
}

export function css() {
    return useCSS(...arguments).toString();
}