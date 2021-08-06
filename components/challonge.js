export default function Challonge({ id }) {
  return ( <iframe title='challonge' className='whitespace' style={{padding: 0, maxWidth: 1100, marginBottom: 0}} src={"https://challonge.com/" + id + "/module"} width="100%" height="600" frameBorder="0" scrolling="auto" allowtransparency="true"></iframe>);
}