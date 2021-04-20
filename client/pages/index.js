import { Table, Input } from 'antd';
import { useState, useEffect } from 'react';


import styles from '../styles/Home.module.css'
import 'antd/dist/antd.css'; 


const data = {"incomingRates" : [
  {
    "incomingExchange": "EUR",
    "targetExchange": "USD"
  },
  {
    "incomingExchange": "EUR",
    "targetExchange": "ARS"
  },
  {
    "incomingExchange": "USD",
    "targetExchange": "ARS"
  },
  {
    "incomingExchange": "EUR",
    "targetExchange": "BRL"
  },
  {
    "incomingExchange": "USD",
    "targetExchange": "BRL"
  },
  {
    "incomingExchange": "BRL",
    "targetExchange": "ARS"
  }
]
}


// fields of the table 
/*

  pair (incoming-target rate)
  original rate
  fee % 
  fee amount 
  rate with markup feed applied 
*/
const columns = [
  {
    title: 'pair',
    dataIndex: 'pair',
    key: 'pair',
  },
  {
    title: 'original rate',
    dataIndex: 'originalRate',
    key: 'originalRate',
  },
  {
    title: 'fee %',
    dataIndex: 'feePercentage',
    key: 'feePercentage',
  },
  {
    title: 'fee amount',
    dataIndex: 'feeAmount',
    key: 'feeAmount',
  },
  {
    title: 'rate with fee aplied ',
    dataIndex: 'rateFee',
    key: 'rateFee',
  }
]

export default function Home() {
  const [ state, setState ] = useState();
  const [ fee, setFee ] = useState(0); 
  function getData () {
    const result = fetch(`${process.env.localBack}/rates`,
    { method: 'POST',  
    body : JSON.stringify(data)})
    return result;  
  }
    function convertDataForTable(data) {
      const result = [];
      data.map(pairExchange => {
        result.push({
          pair: `${pairExchange['incomingExchange']}-${pairExchange['targetExchange']}`,
          originalRate: fee,
          feePercentage: pairExchange['feePercentage'],
          feeAmount: fee * pairExchange['conversion'] - fee,
          rateFee: pairExchange['conversion']
        });
      });
      return result;
    }
    useEffect(async () => {
      const result = await getData(); 
      result.json().then(data => setState(data))
    }, []);

    return (
      <div className={styles.container}>
        <div className={ styles.inputFee }>
        <Input  
              placeholder='fee amount'
              value={fee}
              onChange={e => setFee(e.target.value)} />
        </div>
        { state && <Table
                       dataSource={convertDataForTable(state['incomingRates'])}
                       columns={columns} /> }
    </div>
    
  )
}
