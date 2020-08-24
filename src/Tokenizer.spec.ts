import { Tokenizer } from ".";

class CallbackLogger {
    log: string[] = [];

    onattribdata(value: string) {
        this.log.push(`onattribdata: '${value}'`);
    }
    onattribend() {
        this.log.push(`onattribend`);
    }
    onattribname(name: string) {
        this.log.push(`onattribname: '${name}'`);
    }
    oncdata(data: string) {
        this.log.push(`oncdata: '${data}'`);
    }
    onclosetag(name: string) {
        this.log.push(`onclosetag: '${name}'`);
    }
    oncomment(data: string) {
        this.log.push(`oncomment: '${data}'`);
    }
    ondeclaration(content: string) {
        this.log.push(`ondeclaration: '${content}'`);
    }
    onend() {
        this.log.push(`onend`);
    }
    onerror(error: Error, state?: unknown) {
        this.log.push(`onerror: '${error}', '${state}'`);
    }
    onopentagend() {
        this.log.push(`onopentagend`);
    }
    onopentagname(name: string) {
        this.log.push(`onopentagname: '${name}'`);
    }
    onprocessinginstruction(instruction: string) {
        this.log.push(`onprocessinginstruction: '${instruction}'`);
    }
    onselfclosingtag() {
        this.log.push(`onselfclosingtag`);
    }
    ontext(value: string) {
        this.log.push(`ontext: '${value}'`);
    }
}

describe('Tokenizer', () => {
    test('should support self-closing special tags', () => {
        const logger = new CallbackLogger();
        const tokenizer = new Tokenizer({
            xmlMode: false,
            decodeEntities: false
        }, logger);

        const selfClosingScriptInput = '<script /><div></div>';
        const selfClosingScriptOutput = [
            "onopentagname: 'script'",
            'onselfclosingtag',
            "onopentagname: 'div'",
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(selfClosingScriptInput);
        tokenizer.end();
        expect(logger.log).toEqual(selfClosingScriptOutput);
        tokenizer.reset();
        logger.log = [];

        const selfClosingStyleInput = '<style /><div></div>';
        const selfClosingStyleOutput = [
            "onopentagname: 'style'",
            'onselfclosingtag',
            "onopentagname: 'div'",
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(selfClosingStyleInput);
        tokenizer.end();
        expect(logger.log).toEqual(selfClosingStyleOutput);
        tokenizer.reset();
        logger.log = [];

        const selfClosingTitleInput = '<title /><div></div>';
        const selfClosingTitleOutput = [
            "onopentagname: 'title'",
            'onselfclosingtag',
            "onopentagname: 'div'",
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(selfClosingTitleInput);
        tokenizer.end();
        expect(logger.log).toEqual(selfClosingTitleOutput);
        tokenizer.reset();
        logger.log = [];
       
    });

    test('should support standard special tags', () => {
        const logger = new CallbackLogger();
        const tokenizer = new Tokenizer({
            xmlMode: false,
            decodeEntities: false
        }, logger);

        const normalScriptInput = '<script></script><div></div>';
        const normalScriptOutput = [
            "onopentagname: 'script'",
            'onopentagend',
            "onclosetag: 'script'",
            "onopentagname: 'div'",
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(normalScriptInput);
        tokenizer.end();
        expect(logger.log).toEqual(normalScriptOutput);
        tokenizer.reset();
        logger.log = [];
        
        const normalStyleInput = '<style></style><div></div>';
        const normalStyleOutput = [
            "onopentagname: 'style'",
            'onopentagend',
            "onclosetag: 'style'",
            "onopentagname: 'div'",
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(normalStyleInput);
        tokenizer.end();
        expect(logger.log).toEqual(normalStyleOutput);
        tokenizer.reset();
        logger.log = [];


        const normalTitleInput = '<title></title><div></div>';
        const normalTitleOutput = [
            "onopentagname: 'title'",
            'onopentagend',
            "onclosetag: 'title'",
            "onopentagname: 'div'",
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(normalTitleInput);
        tokenizer.end();
        expect(logger.log).toEqual(normalTitleOutput);
        tokenizer.reset();
        logger.log = [];
    });

    test('should support attributes', () => {
        const logger = new CallbackLogger();
        const tokenizer = new Tokenizer({
            xmlMode: false,
            decodeEntities: false
        }, logger);

        const input = '<div width=100></div>';
        const expectedOutput = [
            "onopentagname: 'div'",
            "onattribname: 'width'",
            "onattribdata: '100'",
            'onattribend',
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(input);
        tokenizer.end();
        expect(logger.log).toEqual(expectedOutput);
    });

    test('should support double quoted attributes', () => {
        const logger = new CallbackLogger();
        const tokenizer = new Tokenizer({
            xmlMode: false,
            decodeEntities: false
        }, logger);

        const input = '<div title="title attribute text"></div>';
        const expectedOutput = [
            "onopentagname: 'div'",
            "onattribname: 'title'",
            "onattribdata: 'title attribute text'",
            'onattribend',
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(input);
        tokenizer.end();
        expect(logger.log).toEqual(expectedOutput);
    });

    test('should support single quoted attributes', () => {
        const logger = new CallbackLogger();
        const tokenizer = new Tokenizer({
            xmlMode: false,
            decodeEntities: false
        }, logger);

        const input = '<div title=\'title attribute text\'></div>';
        const expectedOutput = [
            "onopentagname: 'div'",
            "onattribname: 'title'",
            "onattribdata: 'title attribute text'",
            'onattribend',
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(input);
        tokenizer.end();
        expect(logger.log).toEqual(expectedOutput);
    });

    test('should support curly braced attributes', () => {
        const logger = new CallbackLogger();
        const tokenizer = new Tokenizer({
            xmlMode: false,
            decodeEntities: false,
            curlyBracesInAttributes: true
        }, logger);

        const input = '<div on:click={() => handleClick()}></div>';
        const expectedOutput = [
            "onopentagname: 'div'",
            "onattribname: 'on:click'",
            "onattribdata: '() => handleClick()'",
            'onattribend',
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(input);
        tokenizer.end();
        expect(logger.log).toEqual(expectedOutput);
    });

    test('should support curly braced attributes with escaping in JS strings', () => {
        const logger = new CallbackLogger();
        const tokenizer = new Tokenizer({
            xmlMode: false,
            decodeEntities: false,
            curlyBracesInAttributes: true
        }, logger);

        const input = '<div on:click={() => console.log(\'}\' + "} \\"}" + `}`)}></div>';
        const expectedOutput = [
            "onopentagname: 'div'",
            "onattribname: 'on:click'",
            "onattribdata: '() => console.log('}' + \"} \\\"}\" + `}`)'",
            'onattribend',
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(input);
        tokenizer.end();
        expect(logger.log).toEqual(expectedOutput);
    });

    test('should support curly braced attributes with escaping by inline JS comments', () => {
        const logger = new CallbackLogger();
        const tokenizer = new Tokenizer({
            xmlMode: false,
            decodeEntities: false,
            curlyBracesInAttributes: true
        }, logger);

        const input = '<div on:click={() => console.log("c") /* } */}></div>';
        const expectedOutput = [
            "onopentagname: 'div'",
            "onattribname: 'on:click'",
            "onattribdata: '() => console.log(\"c\") /* } */'",
            'onattribend',
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(input);
        tokenizer.end();
        expect(logger.log).toEqual(expectedOutput);
    });

    test('should support curly braced attributes with nesting scopes', () => {
        const logger = new CallbackLogger();
        const tokenizer = new Tokenizer({
            xmlMode: false,
            decodeEntities: false,
            curlyBracesInAttributes: true
        }, logger);

        const input = '<div styles={{ width: 100, height: 200 }}></div>';
        const expectedOutput = [
            "onopentagname: 'div'",
            "onattribname: 'styles'",
            "onattribdata: '{ width: 100, height: 200 }'",
            'onattribend',
            'onopentagend',
            "onclosetag: 'div'",
            'onend'
        ];

        tokenizer.write(input);
        tokenizer.end();
        expect(logger.log).toEqual(expectedOutput);
    });
});