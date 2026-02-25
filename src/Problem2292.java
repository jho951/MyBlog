import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Problem2292 {
	public static void main(String[] args)throws IOException {
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		int N = Integer.parseInt(br.readLine());

		int layer = 1;  // 시작은 1층
		int maxNumber = 1;

		while (N > maxNumber) {
			maxNumber += 6 * layer;
			layer++;
		}

		System.out.println(layer);
	}
}
