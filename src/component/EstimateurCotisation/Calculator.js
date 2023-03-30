import React, { useState, useEffect } from 'react';

const Calculator = () => {
    
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {

        const script = document.createElement("script");

        //<script data-module="simulateur-embauche" src="https://mon-entreprise.urssaf.fr/simulateur-iframe-integration.js"></script>

        script.src = "https://mon-entreprise.urssaf.fr/simulateur-iframe-integration.js";

        script.addEventListener("load", () => setLoaded(true))

        document.getElementById("calculator").appendChild(script);


    }, []);

    return (
        < div id="calculator">
            {isLoaded}
        </div>
    );
};

export default Calculator;