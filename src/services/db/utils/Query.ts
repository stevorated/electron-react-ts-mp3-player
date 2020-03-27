type ParsedWhere = {
    where: string;
    params: string[];
};

type ParsedFields = {
    fields: string;
    params: string[];
};

export class Query {
    static parseInFilter(array: number[], fieldName: string): string {
        let str = `${fieldName} IN (`;
        array.forEach((_, i) => {
            str += '?';
            if (i < array.length - 1) {
                str += ', ';
            } else {
                str += ')';
            }
        });

        return str;
    }

    static parseWhereClause<T>(entity: Partial<T>): ParsedWhere {
        let where = 'WHERE ';

        const whereKeys = Object.keys(entity) as Array<keyof T>;
        const allParams = Object.values(entity) as (string | number)[];
        const params = allParams
            .filter(param => param !== null)
            .map(param => param.toString());

        for (let i = 0; i < whereKeys.length; i++) {
            where += `${whereKeys[i]} = ? `;
            if (i < whereKeys.length - 1) {
                where += 'AND ';
            }
        }

        return { where, params };
    }

    static parseFields<T>(entity: Partial<T>): ParsedFields {
        let fields = '';

        const keys = Object.keys(entity);
        const params = (Object.values(entity) as (
            | string
            | number
        )[]).map(param => param.toString());

        for (let i = 0; i < keys.length; i++) {
            fields += `"${keys[i]}" = ?`;

            if (i !== keys.length - 1) {
                fields += ', ';
            }
        }

        return { fields, params };
    }

    static parseWheresAndNulls<T>(entity: Partial<T>): ParsedWhere {
        let where = 'WHERE ';
        const params: string[] = [];

        (Object.entries(entity) as (string | number | null)[][])
            .map(p => p.toString())
            .forEach(([key, value], i, arr) => {
                const q = value === null ? 'IS NULL' : '= ?';

                where += `"${key}" ${q}`;
                if (i !== arr.length - 1) {
                    where += ' AND ';
                }

                if (value !== null) {
                    params.push(value.toString());
                }
            });

        return { where, params };
    }
}
