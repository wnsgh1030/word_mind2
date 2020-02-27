exports.map_HTML = (body) => {
    return `<html>
    <head>
      
      <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.14.0/cytoscape.min.js"></script>
      <script src="https://unpkg.com/layout-base/layout-base.js"></script>
      <script src="https://unpkg.com/cose-base/cose-base.js"></script>
      <script src="../script/cytoscape-cose-bilkent.js"></script>
    </head>
    <style>
      #cy {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
      }
    </style>
    <body>  
      <div id="cy"></div>
      <script>
        const data = ${JSON.stringify(body)}
        const cy = cytoscape({
    
          container: document.getElementById('cy'), // container to render in
    
          elements: data,
    
          style: [ // the stylesheet for the graph
            {
              selector: 'node',
              style: {
    
                'background-color': '#666',
                'label': 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center',
                'border-color': 'black',
                'border-width': 4,
                'background-color': 'white'
    
              }
            },
            {
              selector: 'node[type="subject"]',
              style: {
                'shape': 'pentagon',
                'width': '100px',
                'height': '100px',
                'font-size': '10px'
              }
            },
            {
              selector: 'node[type="words"]',
              style: {
                'shape': 'diamond',
                'width': '60px',
                'height': '60px',
                'font-size': '8px'
              }
            },
            {
              selector: 'node[type="examples"]',
              style: {
                'width': '40px',
                'height': '40px',
                'font-size': '6px'
              }
            },
            {
              selector: 'edge',
              style: {
                'label': 'data(label)',
                'width': 3,
                'line-color': '#ccc',
                'curve-style': 'bezier',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'font-size': '6px'
              }
            },
            {
              selector: 'edge[type="word-word"]',
              style:{
                "line-style": "dotted"  
              }
            }
          ],
    
          layout: {
            name: 'cose-bilkent',
            animate: false,
            gravityRangeCompound: 1.5,
            fit: true,
            tile: true
          }

    
    
        });
        cy.on('tap', function (e) {
          const url = e.target.data('url')
          if (url && url !== '') {
              window.open(url);
          }
      });
      </script>
    </body>
    
    </html>`;
}
exports.map_body = (subject, words, examples, relationship) => {
    let data = new Array();
    const subjects = { data: { id: 'subject', label: subject[0].s_name, type: 'subject' } };
    data.push(subjects);

    let i = 0;
    while (i < words.length){
      let content = {data: {id: `word${words[i].w_no}`, label: words[i].w_name, type: 'words', url: `/words/${words[i].w_no}`}};
      let edge = {data: {id: `subject_word${words[i].w_no}`, label: '', source: 'subject', target: `word${words[i].w_no}`, type: 'subject-word'}};
      data.push(content);
      data.push(edge);
      i = i + 1;
    }
    i = 0;
    while(i < examples.length){
      let word = {data: {id: `example${examples[i].e_no}`, label: examples[i].e_name, type: 'examples'}};
      let edge = {data: {id: `word${examples[i].w_no}_example${examples[i].e_no}`, label: '', source: `word${examples[i].w_no}`, target: `example${examples[i].e_no}`, type: 'word-example'}};
      data.push(word);
      data.push(edge);
      i = i + 1;
    }
    i = 0;
    while(i < relationship.length){
      let edge = {data:{id: `word${relationship[i].w1_no}_word${relationship[i].w2_no}`, label: `${relationship[i].description}`, source: `word${relationship[i].w1_no}`, target: `word${relationship[i].w2_no}`, type: 'word-word'}};
      data.push(edge);
      i = i + 1;
    }
    return data;
}