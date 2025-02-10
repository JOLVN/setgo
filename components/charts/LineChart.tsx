import { useFont } from "@shopify/react-native-skia";
import { StyleSheet, View } from "react-native";
import { CartesianChart, Line } from "victory-native";
import { Colors } from "../../constants/styles";

interface LineChartProps {
    data: { x: string, y: number }[];
}

export function LineChart({data}: LineChartProps) {

    return (
        <View style={styles.container}>
            <View style={styles.chartContainer}>
                <CartesianChart 
                    data={data} 
                    xKey="x" 
                    yKeys={["y"]} 
                    yAxis={[{ 
                        lineColor: Colors.gray700,
                     }]}
                    xAxis={{ 
                        lineColor: Colors.gray700,
                     }}
                >
                    {({ points }) => (
                        <Line
                            points={points.y}
                            color={Colors.primary500}
                            strokeWidth={3}
                            animate={{ type: "timing", duration: 300 }}
                        />
                    )}
                </CartesianChart>
            </View>
        </View>
    );
}

export default LineChart;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.gray700,
        borderRadius: 10,
    },
    chartContainer: {
        height: 200,
    },
});