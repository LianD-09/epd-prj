#include <iostream>
#include <vector>
#include <fstream>
#include <cstdint>

std::string base64Decode(const std::string &encoded)
{
    const std::string base64_chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "abcdefghijklmnopqrstuvwxyz"
        "0123456789+/";

    std::vector<uint8_t> decoded;
    int in_len = static_cast<int>(encoded.size());
    int i = 0, j = 0, in_ = 0;
    uint8_t char_array_4[4], char_array_3[3];

    while (in_len-- && (encoded[in_] != '=') && (isalnum(encoded[in_]) || (encoded[in_] == '+') || (encoded[in_] == '/')))
    {
        char_array_4[i++] = encoded[in_];
        in_++;
        if (i == 4)
        {
            for (i = 0; i < 4; i++)
                char_array_4[i] = base64_chars.find(char_array_4[i]);

            char_array_3[0] = (char_array_4[0] << 2) + ((char_array_4[1] & 0x30) >> 4);
            char_array_3[1] = ((char_array_4[1] & 0x0F) << 4) + ((char_array_4[2] & 0x3C) >> 2);
            char_array_3[2] = ((char_array_4[2] & 0x03) << 6) + char_array_4[3];

            for (i = 0; i < 3; i++)
                decoded.push_back(char_array_3[i]);
            i = 0;
        }
    }

    if (i)
    {
        for (j = i; j < 4; j++)
            char_array_4[j] = 0;

        for (j = 0; j < 4; j++)
            char_array_4[j] = base64_chars.find(char_array_4[j]);

        char_array_3[0] = (char_array_4[0] << 2) + ((char_array_4[1] & 0x30) >> 4);
        char_array_3[1] = ((char_array_4[1] & 0x0F) << 4) + ((char_array_4[2] & 0x3C) >> 2);
        char_array_3[2] = ((char_array_4[2] & 0x03) << 6) + char_array_4[3];

        for (j = 0; j < i - 1; j++)
            decoded.push_back(char_array_3[j]);
    }

    return std::string(decoded.begin(), decoded.end());
}

std::vector<uint8_t> base64ToBitmapArray(const std::string &base64String)
{
    // Decode Base64 string
    std::string decodedData = base64Decode(base64String);

    // Create a vector from the decoded data
    std::vector<uint8_t> imageData(decodedData.begin(), decodedData.end());

    return imageData;
}

int main()
{
    // Replace "your_base64_string_here" with your actual Base64-encoded image string
    std::string base64String = "your_base64_string_here";

    // Convert Base64 to bitmap array
    std::vector<uint8_t> bitmapArray = base64ToBitmapArray(base64String);
    for (int i = 0 ; i< bitmapArray.size(); i++){
        std::cout << bitmapArray[i];
    }

    // Access the pixel values in the 'bitmapArray' vector as needed

    return 0;
}
