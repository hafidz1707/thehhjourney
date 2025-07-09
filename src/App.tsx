import React, { useState } from 'react';
import { Heart, Calendar, MapPin, Gift, Clock, ChevronDown } from 'lucide-react';
import photo1 from './assets/photo1.jpeg';
import photo2 from './assets/photo2.jpeg';
import photo3 from './assets/photo3.jpeg';
import photo4 from './assets/photo4.jpeg';
import photo5 from './assets/photo5.jpeg';
import photo6 from './assets/photo6.jpeg';
import photohelmi from './assets/helminobg.png';
import photohafidz from './assets/hafidznobg.png';
import photoborder from './assets/photo-border.png';
import petalimg from './assets/petal.png';
import { useRef, useEffect } from 'react';
import Petal from './petal'

function App() {
  const [showContent, setShowContent] = useState(false);
  const [hideCover, setHideCover] = useState(false);
  const weddingDate = new Date('2025-07-19T00:00:00');
  //const contentRef = useRef(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [nama, setNama] = useState('');
  const [kehadiran, setKehadiran] = useState<boolean | null>(null);
  const [ucapan, setUcapan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  type Ucapan = {
    nama: string;
    pesan: string;
  };
  type UcapanResponse = {
    currentPage: number;
    totalPage: number;
    totalRows: number;
    data: Ucapan[];
  };
  const [dataUcapan, setDataUcapan] = useState<UcapanResponse['data']>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const calculateTimeLeft = () => {
    const difference = +weddingDate - +new Date();
    const timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
    return timeLeft;
  };

  const handleOpenInvitation = () => {
    setShowContent(true);
    setHideCover(true);

    // Delay scroll to allow rendering first
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0); // Short delay

  };

  const galleries = [photo1, photo6, photo3, photo5, photo4, photo2];

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    const playMusic = () => {
      const bgm = document.getElementById('bgm') as HTMLAudioElement;
      if (bgm) {
        bgm.play().catch((err) => {
          console.warn('Autoplay failed:', err);
        });
      }
      window.removeEventListener('click', playMusic);
    };

    window.addEventListener('click', playMusic);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const body = {
      Nama: nama,
      Kehadiran: kehadiran,
      Pesan: ucapan,
    };

    try {
      const response = await fetch('https://thehhjourneyapi-665803744151.asia-southeast2.run.app/Ucapan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        //alert('Ucapan berhasil dikirim!');
        setNama('');
        setKehadiran(null);
        setUcapan('');
        //window.location.reload(); // 🔄 Reload the page
      } else {
        alert('Gagal mengirim ucapan.');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi.');
      console.error(error);
    } finally {
      setSubmitting(false);
      fetchUcapan(1);
    }
  };

  React.useEffect(() => {
    const canvas = document.getElementById("petal-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    const img = new Image();
    img.src = petalimg; // make sure `petalimg` is imported or defined correctly
  
    const petals: Petal[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
  
    canvas.width = width;
    canvas.height = height;
  
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
  
    window.addEventListener("resize", handleResize);
  
    img.onload = () => {
      for (let i = 0; i < 50; i++) {
        petals.push(new Petal(img, width, height));
      }
  
      const animate = () => {
        ctx.clearRect(0, 0, width, height);
        for (let petal of petals) {
          petal.update(width, height);
          petal.draw(ctx);
        }
        requestAnimationFrame(animate);
      };
  
      animate();
    };
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchUcapan = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`https://thehhjourneyapi-665803744151.asia-southeast2.run.app/Ucapan?page=${page}`);
      const result: UcapanResponse = await res.json();
      setDataUcapan(result.data);
      setCurrentPage(result.currentPage);
      setTotalPage(result.totalPage);
    } catch (error) {
      console.error('Failed to fetch ucapan:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUcapan(currentPage);
  }, []);

  return (
    <>
    
    <canvas id="petal-canvas" className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none"/>
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100">
    <section   className={`fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-rose-50 to-rose-100 z-25 transition-opacity duration-700 ${
    hideCover ? 'opacity-0 pointer-events-none' : 'opacity-100'
  }`}>
    {/* {!hideCover && ( */}
      {(
        <>
            {/* Cover Section */}
            <section className="h-screen flex flex-col items-center justify-center relative text-center px-4">
              <div className="space-y-6 animate-fade-in">
                <Heart className="w-16 h-16 text-rose-400 mx-auto animate-pulse" />
                <h1 className="font-serif text-4xl md:text-6xl text-gray-800">Helmi & Hafidz</h1>
                <p className="text-gray-600">Kami mengundang Anda untuk merayakan hari bahagia kami</p>
                <p className="font-serif text-2xl text-gray-700">19 Juli 2025</p>
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <div className="text-2xl font-bold text-rose-400">{timeLeft.days}</div>
                    <div className="text-sm text-gray-600">Hari</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <div className="text-2xl font-bold text-rose-400">{timeLeft.hours}</div>
                    <div className="text-sm text-gray-600">Jam</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <div className="text-2xl font-bold text-rose-400">{timeLeft.minutes}</div>
                    <div className="text-sm text-gray-600">Menit</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <div className="text-2xl font-bold text-rose-400">{timeLeft.seconds}</div>
                    <div className="text-sm text-gray-600">Detik</div>
                  </div>
                </div>
                <div className="mb-16">
                  <button
                    onClick={() => handleOpenInvitation()}
                    className="px-8 py-3 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-all shadow-lg"
                  >
                    Buka Undangan
                  </button>
                </div>
              </div>

              <ChevronDown className="absolute bottom-8 w-8 h-8 text-gray-400 animate-bounce" />
            </section>

        </>
      )
      }
          </section>

      {showContent && (
        <>
          {/* Mempelai Section */}
          <section className="py-20 px-4 bg-rose-50" ref={contentRef}>
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <h2 className="font-serif text-3xl md:text-4xl text-gray-800">Mempelai</h2>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4 group">
                  <div className="relative">
                    <img
                      src={photohafidz}
                      alt="Mempelai Pria"
                      className="w-64 h-64 object-cover rounded-full mx-auto ring-4 ring-rose-200 group-hover:ring-rose-400 transition-all duration-300 object-contain"
                      />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-gray-800">Hafidz Naufal Aryan</h3>
                    <p className="text-gray-600 mt-2">Putra Pertama dari</p>
                    <p className="text-gray-800 font-medium">Bpk. Agus Prikuncoro & Ibu Siti Muthingah</p>
                    <div className="mt-4 flex justify-center space-x-4">
                      <a href="https://instagram.com/hafidznaufalaryann" target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-500">@hafidz</a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 group">
                  <div className="relative">
                    <img
                      src={photohelmi}
                      alt="Mempelai Wanita"
                      className="w-64 h-64 object-cover rounded-full mx-auto ring-4 ring-rose-200 group-hover:ring-rose-400 transition-all duration-300"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-gray-800">Helmi Adiningtyas</h3>
                    <p className="text-gray-600 mt-2">Putri Kedua dari</p>
                    <p className="text-gray-800 font-medium">Bpk. Pujiadi & Ibu Siti Bariroh</p>
                    <div className="mt-4 flex justify-center space-x-4">
                      <a href="https://instagram.com/helmyadrr" target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-500">@helmi</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Acara Section */}
          <section className="py-20 px-4 bg-white">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <h2 className="font-serif text-3xl md:text-4xl text-gray-800">Jadwal Acara</h2>

              <div className="grid md:grid-cols-1 gap-8">

                <div className="bg-rose-50 p-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Gift className="w-8 h-8 text-rose-400" />
                  </div>
                  <h3 className="font-serif text-2xl text-gray-800 mb-4">Resepsi</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Sabtu, 19 Juli 2025
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5" />
                      11:00 WIB - selesai
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Desa Kedungpring RT 03/03, Kec. Kemranjen, Kab. Banyumas, Jawa Tengah 53194
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="https://maps.app.goo.gl/ZaKFNbJ1B9JBWnWWA?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-all shadow-lg"
                >
                  <MapPin className="w-5 h-5" />
                  Lihat Lokasi
                </a>
              </div>
            </div>
          </section>

          {/* Galeri Section */}
          <section className="py-20 px-4 bg-rose-50">
            <div className="max-w-6xl mx-auto text-center space-y-12">
              <h2 className="font-serif text-3xl md:text-4xl text-gray-800">Galeri Foto</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {
                  galleries.map((url, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-lg">
                      <img
                        src={url}
                        alt={`Pre-wedding ${index + 1}`}
                        className="w-full h-48 md:h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-500"></div>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          {/* RSVP Section */}
          <section className="py-20 px-4 bg-white">
            <div className="max-w-xl mx-auto text-center space-y-8">
              <h2 className="font-serif text-3xl md:text-4xl text-gray-800">Ucapan & Doa</h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                />
                <select                   
                  value={kehadiran === null ? '' : String(kehadiran)}
                  onChange={(e) => setKehadiran(e.target.value === 'true')}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 text-gray-500">
                  <option value="" disabled selected>Konfirmasi Kehadiran</option>
                  <option value="true">Ya, Saya Akan Hadir</option>
                  <option value="false">Maaf, Saya Tidak Bisa Hadir</option>
                </select>
                <textarea
                  placeholder="Ucapan & Doa"
                  rows={4}
                  value={ucapan}
                  onChange={(e) => setUcapan(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                ></textarea>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-all shadow-lg"
                >
                  Kirim
                </button>
              </form>

              <div className="max-w-xl mx-auto space-y-8 text-left">
              {/* <h2 className="text-2xl font-serif text-center text-gray-800">Ucapan & Doa</h2> */}
              {loading ? (
              <p className="text-center text-gray-500">Loading ucapan...</p>
            ) : dataUcapan.length === 0 ? (
              <p className="text-center text-gray-500">Belum ada ucapan.</p>
            ) : (
              <div>
              <ul className="space-y-6">
                {dataUcapan.map((item, index) => (
                  <li key={index} className="bg-white p-4 rounded-lg shadow border border-rose-100">
                    <p className="font-semibold text-gray-800">{item.nama}</p>
                    <p className="text-gray-700">{item.pesan}</p>
                  </li>
                ))}
              </ul>

              <div className="flex justify-center gap-2 pt-4">
                {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchUcapan(page)}
                    className={`px-4 py-2 rounded-full border ${
                      page === currentPage
                        ? 'bg-rose-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-rose-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              </div>
            )}
            </div>
            
          </div>
          </section>

          {/* Footer */}
          <footer className="py-8 px-4 bg-rose-50 text-center text-gray-600">
            <div className="max-w-xl mx-auto space-y-4">
              <Heart className="w-8 h-8 text-rose-400 mx-auto" />
              <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami</p>
              <p className="font-serif text-xl text-gray-800 mt-4">Helmi & Hafidz</p>
            </div>
          </footer>
        </>
      )}
    </div>
    </>
  );
}

export default App;