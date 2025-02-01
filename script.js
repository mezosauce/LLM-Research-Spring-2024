document.addEventListener("DOMContentLoaded", function () {
    var TestGraph = cytoscape({
        container: document.getElementById('cy'),
        elements: [
            { data: { id: 'Idle', label: 'Idle' } },
            { data: { id: 'MemberJoined', label: 'Member Joined' } },
            { data: { id: 'ReactionAdded', label: 'Reaction Added' } },
            { data: { id: 'ResponseAdded', label: 'Response Added' } },
            { data: { id: 'UserTagged', label: 'User Tagged' } },
            
            { data: { source: 'Idle', target: 'MemberJoined', label: 'User Joins' } },
            { data: { source: 'MemberJoined', target: 'ReactionAdded', label: 'Reaction Added' } },
            { data: { source: 'MemberJoined', target: 'ResponseAdded', label: 'Response Added' } },
            { data: { source: 'MemberJoined', target: 'UserTagged', label: 'User Tagged' } },
            { data: { source: 'ReactionAdded', target: 'Idle', label: 'Reaction Removed' } },
            { data: { source: 'ResponseAdded', target: 'Idle', label: 'Response Removed' } },
            { data: { source: 'UserTagged', target: 'Idle', label: 'Tag Removed' } }
        ],
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#007bff',
                    'label': 'data(label)',
                    'color': '#fff',
                    'text-valign': 'center',
                    'text-halign': 'center'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'label': 'data(label)',
                    'text-rotation': 'autorotate',
                    'color': '#000',
                    'font-size': '12px'
                }
            }
        ],
        layout: {
            name: 'cose'
        }
    });
});