import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (_env, argv) => ({
    entry: {
        app: "./src/app.js",
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
        open: true,
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['app']
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        clean: true,
        publicPath: argv.mode === "production"
            ? "/romantic-page/"
            : "/",
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: "asset/resource",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
});
