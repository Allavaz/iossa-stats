const encuser = encodeURIComponent(process.env.DB_USER);
const encpw = encodeURIComponent(process.env.DB_PASS);
const authMechanism = "DEFAULT";
const url = `mongodb+srv://${encuser}:${encpw}@${process.env.DB_HOST}/?authMechanism=${authMechanism}`;

export default url;
