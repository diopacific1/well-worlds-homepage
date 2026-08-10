fetch('https://fchart.stock.naver.com/sise.nhn?symbol=005930&timeframe=day&count=12&requestType=0')
  .then(r => r.text())
  .then(xml => {
    const regex = /<item data="([^"]+)" \/>/g;
    let match;
    const candles = [];
    const chartData = [];
    while ((match = regex.exec(xml)) !== null) {
      const parts = match[1].split('|');
      const date = parts[0];
      const open = parseFloat(parts[1]);
      const high = parseFloat(parts[2]);
      const low = parseFloat(parts[3]);
      const close = parseFloat(parts[4]);
      const vol = parseFloat(parts[5]);
      candles.push({
        time: date,
        open, high, low, close, volume: vol
      });
      chartData.push(close);
    }
    console.log(candles.slice(-2));
  }).catch(console.error);
