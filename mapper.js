module.exports = function(RED) {

    function Mapper(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        node.property = config.property||"payload";
        node.keyframes = config.keyframes;
        node.inputFrom = Number(config.inputFrom)
        node.inputTo = Number(config.inputTo)
        node.outputFrom = Number(config.outputFrom)
        node.outputTo = Number(config.outputTo)
        node.rounding = Number(config.rounding)
        node.inputOutOfRangeStrategy = config.inputOutOfRangeStrategy


        node.on('input', function(msg, send, done) 
        {
            send = send || function() { node.send.apply(node, arguments) }
            
            let x = RED.util.getMessageProperty(msg, node.property);
            if( x !== undefined )
            {
                x = Number(x)
                if(isNaN(x))
                {
                    node.error(`Property is not a number: ${x}`)
                    if(done)
                        done()
                    return
                }
                let y = x;
                if( inInputRange(x) )
                {
                    y = computeOutput(x)   
                }
                else
                {
                    switch(node.inputOutOfRangeStrategy)
                    {
                        case 'leave':
                            if(done)
                                done()
                            node.send(msg);
                            return
                        case 'block':
                            if(done)
                                done()
                            return
                        case 'limitKeyframe':
                            if(x < node.inputFrom )
                                y = computeOutput(node.inputFrom)
                            else 
                                y = computeOutput(node.inputTo)
                            break
                        case 'limitRange':
                            if(x < node.inputFrom )
                                y = node.outputFrom
                            else 
                                y = node.outputTo
                            break
                        default:
                            node.error('unknown input out of range strategy option (node.inputOutOfRangeStrategy)', msg)
                            return
                    }
                }
                
                if(node.rounding>=0)
                    y = Number(y.toFixed(node.rounding))

                RED.util.setMessageProperty(msg, node.property, y)

                

                node.send(msg);
            }

            if(done)
                done()
        });

        function computeOutput(x)
        {
            let y = x
            let normalizedX = normalize(x, node.inputFrom, node.inputTo);
            for(var i = 0; i < node.keyframes.length; i++)
            {
                if( i === 0 )
                    continue;

                if( (normalizedX < node.keyframes[i].x) || (( i === node.keyframes.length-1) && normalizedX === node.keyframes[i].x) )
                {
                    var startKeyframe = node.keyframes[i-1];
                    var endKeyframe = node.keyframes[i];
                    y = interpolateLinear(startKeyframe.y, endKeyframe.y, normalizedX);
                    break;
                }
            }
            return node.outputFrom + (node.outputTo-node.outputFrom) * y;
        }

        function inInputRange(x)
        {
            return ( x>= node.inputFrom && x <= node.inputTo);
        }

        function getXFromMessage(msg)
        {
            return msg.payload;
        }
     
        function normalize(x, min, max){
            if( max == min )
                return 0;
            return (x-min)/(max-min);
        }
        function interpolateLinear(a, b, x) {
            return ((b * x)+(a * (1-x)));
        }

    }
    RED.nodes.registerType("mapper",Mapper);

    RED.httpAdmin.get('/mapper/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };

        res.sendFile(req.params[0], options);
    });
}