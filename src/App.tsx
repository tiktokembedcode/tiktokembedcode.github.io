import {useEffect, useRef, useState} from 'react'
import Content from "./components/Content.tsx";
import copy from 'copy-to-clipboard';

function useExternalScripts(url: string) {
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute("src", url);
    head?.appendChild(script);

    return () => {
      head?.removeChild(script);
    };
  }, [url]);
}

const App = () => {
  const [embedType, setEmbedType] = useState<string>("video")
  const [url, setUrl] = useState<string>('https://www.tiktok.com/@google/video/7371162001336323371');
  const [embedString, setEmbedString] = useState<string>('');
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [copyButtonClicked, setCopyButtonClicked] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const embedCodeRef = useRef<HTMLInputElement | null>(null);

  useExternalScripts("https://www.tiktok.com/embed.js");

  useEffect(() => {
    setError('');
    setCopyButtonClicked(false);
    generateEmbedCode();
  }, [url]);

  useEffect(() => {
    setCopyButtonClicked(false);

    if (embedUrl == '') {
      switch (embedType) {
        case "video":
          setUrl("https://www.tiktok.com/@google/video/7371162001336323371");
          break;
        case "profile":
          setUrl("https://www.tiktok.com/@google");
          break;
        case "hashtag":
          setUrl("https://www.tiktok.com/tag/funnydance");
          break;
        case "sound":
          setUrl("https://www.tiktok.com/music/original-sound-Xwitter-7397447022627932934");
          break;
      }
    }

  }, [embedType]);

  const generateEmbedCode = (): string => {
    try {
      var urlObject = new URL(url);
    } catch (e) {
      return '';
    }

    const resourceId = urlObject ? urlObject.pathname.split("/").pop().replace("@", "") : '';
    let embedCode = `<blockquote class="tiktok-embed" cite="${url}" data-video-id="${resourceId}" data-embed-from="embed_page" style="max-width:605px; min-width:325px;"><section></section><a href="https://producer.ua" style="display:none;">talent manager</a></blockquote><script async src="https://www.tiktok.com/embed.js"></script>`;

    switch (embedType) {
      case "profile":
        embedCode = `<blockquote class="tiktok-embed" cite="${url}" data-unique-id="${resourceId}" data-embed-from="embed_page" data-embed-type="creator" style="max-width:780px; min-width:288px;"><section></section><a href="https://producer.ua" style="display:none;">talent manager</a></blockquote><script async src="https://www.tiktok.com/embed.js"></script>`;
        break;
      case "hashtag":
        embedCode = `<blockquote class="tiktok-embed" cite="${url}" data-tag-id="${resourceId}" data-embed-from="embed_page" data-embed-type="tag" style="max-width:780px; min-width:288px;"><section></section><a href="https://producer.ua" style="display:none;">talent manager</a></blockquote><script async src="https://www.tiktok.com/embed.js"></script>`;
        break;
      case "sound":
        embedCode = `<blockquote class="tiktok-embed" cite="${url}" data-music-id="${resourceId}" data-embed-from="embed_page" data-embed-type="music" style="max-width:780px; min-width:288px;"><section></section><a href="https://producer.ua" style="display:none;">talent manager</a></blockquote><script async src="https://www.tiktok.com/embed.js"></script>`;
        break;
    }

    setEmbedString(embedCode);
    setEmbedUrl(embedUrl);

    return embedCode;
  }

  const handleCopyClick = () => {
    copy(embedString);
    setCopyButtonClicked(true);
    embedCodeRef.current?.select();
  };

  return (
    <>
      <div className={'bg-white p-4 sm:px-10'}>
        <div className={'max-w-[1080px] mx-auto'}>
          <h1 className={'text-2xl font-bold sm:text-3xl'}>TikTok embed
            code
            generator</h1>
          <small>Easily embed a TikTok widget to your site!</small>
        </div>
      </div>
      <div className={'max-w-[1080px] mx-auto my-4 p-4 bg-white sm:p-10'}>
        <div>
          <b>Which type of embed would you like to create?</b>
          <div className={'flex gap-4'}>
            <label className={'flex gap-2'}>
              <input
                type="radio"
                name="type"
                value="video"
                checked={embedType === "video"}
                onChange={e => setEmbedType(e.target.value)}
              />Video
            </label>
            <label className={'flex gap-2'}>
              <input
                type="radio"
                name="type"
                value="profile"
                checked={embedType === "profile"}
                onChange={e => setEmbedType(e.target.value)}
              />Profile
            </label>
            <label className={'flex gap-2'}>
              <input
                type="radio"
                name="type"
                value="hashtag"
                checked={embedType === "hashtag"}
                onChange={e => setEmbedType(e.target.value)}
              />Hashtag
            </label>
            <label className={'flex gap-2'}>
              <input
                type="radio"
                name="type"
                value="sound"
                checked={embedType === "sound"}
                onChange={e => setEmbedType(e.target.value)}
              />Sound
            </label>
          </div>
        </div>
        <div
          className={`flex flex-col mb-4 justify-between gap-4 ${embedType === "video" && 'md:flex-row'}`}>
          <div className={'flex flex-col w-full gap-2 mt-[18px]'}>
            <label>
              <input
                type="url"
                name="url"
                placeholder={'Enter a URL to create an embed code'}
                onChange={e => setUrl(e.target.value)}
              />
            </label>
            <label>
              <input
                type="text"
                ref={embedCodeRef}
                name="embed-code"
                value={embedString}
                readOnly
                placeholder={'Generated embed code'}
              />
            </label>
            <button
              className={`px-4 py-2 rounded text-white ${copyButtonClicked ? 'bg-green-600' : 'bg-sky-600'} transition-[background] hover:bg-sky-700 active:bg-green-600`}
              onClick={handleCopyClick}>{copyButtonClicked ? 'Copied!' : 'Copy embed code'}
            </button>
            {error && <div className={'text-red-500'}>{error}</div>}
          </div>
          <div dangerouslySetInnerHTML={{__html: embedString}}></div>
        </div>
        <Content/>
      </div>
      <small
        className={'block mb-4 text-center'}>&copy; 2020-{new Date().getFullYear()}.
        Ivatech.dev. TikTok Embed Code Generator.</small>
    </>
  )
}

export default App
