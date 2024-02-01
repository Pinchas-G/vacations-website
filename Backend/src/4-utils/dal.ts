import mysql, { OkPacket } from 'mysql';
import appConfig from './app-config';

const { host, database, user, password } = appConfig;

const connection = mysql.createPool({
    host, database, user, password
})

type DbResult<T> = {
    result: T,
    okPacket?: OkPacket
}

export async function executeSP(name: string, ...params: (string | number)[]): Promise<OkPacket>
export async function executeSP<T>(name: string, ...params: (string | number)[]): Promise<DbResult<T>>
export async function executeSP<T>(name: string, ...params: (string | number)[]): Promise<DbResult<T> | OkPacket> {
    return new Promise((res, rej) => {
        const p = params.map(p => '?').join(',');
        let response: DbResult<T> | OkPacket;

        connection.query(`CALL ${name}(${p})`, params.map(p => p ?? null), (err, result) => {
            
            if (result && Array.isArray(result[0])) {
                response = {
                    result: result[0] as T,
                    okPacket: result[1]
                }
            }
            else if(result) {
                response = result as OkPacket
            }
            err ? rej(err) : res(response);            
        })
    })
}
