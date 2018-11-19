# Infura Infrastructure Project

This is a take-home project for the Infura backend+infrastructure team that we would like 
you to attempt. You'll find a number of steps to complete below that will 
require some coding on your part; return any code and/or documents you wrote 
to us when you feel comfortable with the result.

Feel free to use the programming/scripting language you're most comfortable 
with (Go is preferred) and tools, libraries, or 
frameworks you believe are best suited to the tasks listed below. There is no 
strict time limit, but if possible please return this to us within one week.

Please note and let us know how long you worked on the project; this is for 
informational purposes and allows us to make adjustments and improvements for 
future applicants (feel free to provide feedback on the project too).


1. Register for an [Infura API key](https://infura.io/signup)
    1. You will have to use this key for subsequent requests to Infura endpoints, 
    as briefly shown in the [Setup](https://infura.io/setup) section of the site
2. Create an application that retrieves Ethereum Mainnet transaction and block 
data via the Infura JSON-RPC API from 
[https://pmainnet.infura.io](https://pmainnet.infura.io/)
    1. Examples of useful methods include eth_getTransactionByBlockNumberAndIndex or eth_getBlockByNumber, but feel free to add any other methods (be advised that some RPC methods are not allowed via our endpoints -- for example, those that manage accounts)
    2. See [the Infura API docs](https://infura.docs.apiary.io/#) for information on the supported APIs
    3. See [the Ethereum docs](https://github.com/ethereum/wiki/wiki/JSON-RPC) for information on the 
    Ethereum API itself
3. Expose the retrieved transaction and block data via REST endpoints that your 
application provides
    1. To sanity check your results, feel free to use the similar functionality
    at the [Infura Hub](https://hub.infura.io/mainnet)
4. Set up your application to run in a [Docker container](https://www.docker.com)
5. Create a load test for your application
6. Run some load test iterations and document the testing approach and the 
results obtained
    1. Specify some performance expectations given the load test results: 
    e.g., this application is able to support X requests per minute
7. Write up a short document describing the general setup of the components 
you've put together as well as instructions to run your application
8. **Bonus points**: add unit tests to cover most of the code you've written
9. Submit your application and load test code, as well as associated 
documentation, to the master branch of the Github repository 
we've set up for this purpose
