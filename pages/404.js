import Head from 'next/head';

export default function Error404() {
  return (
    <>
      <Head>
        <title>Error 404 | IOSoccer Sudamérica</title>
      </Head>
      <div className='whitespace' style={{paddingLeft: '25px'}}>
        <h3>ERROR 404 - PÁGINA NO ENCONTRADA</h3>
        <img src='/404.jpg' alt='Error 404' />
      </div>
    </>
  )
}