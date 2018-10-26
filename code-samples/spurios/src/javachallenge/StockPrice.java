package javachallenge;

public class StockPrice {
    protected int getBestPrice(int[] values) {
        int lowestSeen = -1;
        int bestProfit = 0;

        for (int value : values) {
            if (lowestSeen < 0) lowestSeen = value; // first value of array
            else {
                int bestProfitNow = value - lowestSeen;
                if (bestProfitNow > bestProfit) bestProfit = bestProfitNow;
                if (value < lowestSeen) lowestSeen = value;
            }
        }
        return bestProfit;
    }

    public static class BestProfitTest {
        BestProfitTest() {
            StockPrice solution = new StockPrice();
            int[] input = {10, 7, 5, 8, 11, 9}; // # Returns 6 (buying for $5 and selling for $11)
            int expected = 6;
            int actual = solution.getBestPrice(input);
            System.out.printf("Best price: %d ok: %s\n", actual, actual == expected);

        }
    }

    public static void main(String args[] ) throws Exception {
        new StockPrice.BestProfitTest();
    }
}