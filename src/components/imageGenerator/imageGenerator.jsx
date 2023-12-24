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
                    Authorization: "Bearer " + process.env.REACT_APP_OPENAI_KEY,
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
            <div className='header'>UIAUI image <span>generator</span></div>
            <div className='img-loading'>
                <div className='image'>
                    <img src={image_url === '/' ? default_image : image_url} alt="Generated"/>
                </div>
            </div>
            <div className='search-box'>
                <input type="text" ref={inputRef} className='search-input' placeholder='Enter prompt'/>
                <div className='loading'>
                    <div className={loading ? "loading-bar-full" : "loading-bar"}>
                        <div className={loading ? "loading-text" : "display-none"}>Loading...</div>
                    </div>
                </div>
                <div className="generate-btn" onClick={imageGenerator}>Generate</div>
            </div>
        </div>
    );
}

export default ImageGenerator;
