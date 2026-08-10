fetch('https://fchart.stock.naver.com/sise.nhn?symbol=005930&timeframe=week&count=12&requestType=0')
  .then(r => r.text())
  .then(xml => console.log(xml.substring(0, 300)))
