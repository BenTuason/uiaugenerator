import React, { useState, useRef } from 'react';
import './imageGenerator.css';
import default_image from '../assets/default_image.svg';

const ImageGenerator = () => {
    const [image_url, setImage_url] = useState("/");
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const imageGenerator = async () => {
        if (inputRef.current.value === "") {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
                    "User-Agent": "Chrome",
                },
                body: JSON.stringify({
                    prompt: inputRef.current.value,
                    n: 1,
                    size: "1024x1024",
                }),
            });

            if (!response.ok) {
                // Handle HTTP errors
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }

            let data = await response.json();
            if (data.data && data.data.length > 0) {
                setImage_url(data.data[0].url);
            } else {
                // Handle unexpected response format
                console.error("Unexpected response format:", data);
                setImage_url('/');
            }
        } catch (error) {
            console.error("Error during image generation:", error);
            setImage_url('/');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='uiaui-image-generator'>
            <div className='header'>UIAUI Image <span>Generator</span></div>
            <div className='description'>This works as a default image generator. But the point is to generate any sort of couples in any form. Whether they be two raccoons in a trash bin, two polar bears in an igloo, or even two tomatoes growing right next to each other in the same stem. Whatever it is that you generate I hope this makes you smile and laugh even just a little bit. Your happiness means the entire world to me and I appreciate you being with me constantly supporting me whether I'm struggling or celebrating. UIAUI generator stands for "Us in another universe image generator." Symbolzing that whatever we become in every universe, we'll always find each other and be together. I love you forever and always Angelica.</div>
            <div className='instructions'>To start, even though it works as a normal image generator and you're free to use your imagination. Here are some prompts that you can start with: "A couple reincarnated as polar bears" or "a romantic couple in another universe that are now raccoons in a trashcan." Note that some of the images generated stating specific characters (Ex: Yasuo, Katarina, Sasuke,) might not generate too well.  </div>
            <div className='img-loading'>
                <div className='image'>
                    <img src={image_url === '/' ? default_image : image_url} alt="Generated"/>
                </div>
            </div>
            <div className='loading'>
                    <div className={loading ? "loading-bar-full" : "loading-bar"}>
                        <div className={loading ? "loading-text" : "display-none"}>Loading...</div>
                    </div>
                </div>
            <div className='search-box'>
            <input type="text" ref={inputRef} className='search-input' placeholder='A couple in another universe as two cats on a park'/>
                <div className="generate-btn" onClick={imageGenerator}>Generate</div>
            </div>
        </div>
    );
}

export default ImageGenerator;
