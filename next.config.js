/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
}

module.exports = nextConfig

// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.(png|jpe?g|gif)$/i,
//         use: [
//           {
//             loader: "file-loader",
//           },
//         ],
//       },
//     ],
//   },
// };