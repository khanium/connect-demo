function loadDataset() {
    console.log('call post /load/dataset here...');
    fetch('/connect/load/dataset', { method: 'POST'})
        .then(r => console.log('load response: ',r));
}