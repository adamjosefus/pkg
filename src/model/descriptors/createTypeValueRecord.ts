import { TypeObject } from "./TypeObject.ts";
import { ValueObject } from "./ValueObject.ts";
import { indent } from "../serializers/indent.ts";
import { indentLines } from "../serializers/indentLines.ts";
import { escapeObjectKey } from "../serializers/escapeObjectKey.ts";

type TypeOptions = Omit<TypeObject, 'serializedDeclaration'>;
type ValueOptions = Omit<ValueObject, 'default' | 'type'>;
type Structure = Record<string, ValueObject>;


const splitStructure = (structure: Structure) => {
    const types = new Map<string, TypeObject>();
    const values = new Map<string, ValueObject>();

    Object.entries(structure).forEach(([key, value]) => {
        const type = value.type;

        types.set(key, type);
        values.set(key, value);
    })

    return [types, values] as const;
}


const existsDefault = (map: Map<string, ValueObject>) => Array.from(map.values()).some(v => v.default !== undefined);


export const createTypeValueRecord = (typeOptions: TypeOptions, valueOptions: ValueOptions, structure: Structure) => {
    const [typeMap, valueMap] = splitStructure(structure);

    const depends: TypeObject[] = Array.from(typeMap.values());
    const hasDefault = existsDefault(valueMap);

    const getDefault = () => {
        const lines = Array.from(valueMap)
            .filter(([_, t]) => !t.default)
            .map(([k, t]) => {
                const key = escapeObjectKey(k);
                const value = JSON.stringify(t.default!());

                return indent(`${key}: ${value},`);
            });

        lines.unshift('{');
        lines.push('}');

        return lines.join(`\n`);
    }

    const type: TypeObject = {
        include: true,
        depends: [...depends, ...typeOptions.depends],
        name: typeOptions.name,
        optional: typeOptions.optional,
        docComment: typeOptions.docComment,
        serializedDeclaration: () => {
            const lines = Array.from(typeMap)
                .map(([k, t]) => {
                    const key = escapeObjectKey(k);
                    const declaration = t.serializedDeclaration();
                    const flag = t.optional() ? '?' : '';

                    return indent(`${key}${flag}: ${indentLines(declaration, true)},`);
                });

            lines.unshift('{');
            lines.push('}');

            return lines.join(`\n`);
        }
    }

    const value: ValueObject = {
        default: hasDefault ? getDefault : undefined,
        docComment: valueOptions.docComment,
        type,
    };

    return [type, value] as [TypeObject, ValueObject];
}
