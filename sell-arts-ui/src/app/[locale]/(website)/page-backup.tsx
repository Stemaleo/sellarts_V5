import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Palette, ShoppingBag, Star } from "lucide-react";
import bg from "@/assets/bg.jpg";
import paint2 from "@/assets/paint2.avif";
import paint1 from "@/assets/paint1.avif";
import paint3 from "@/assets/paint3.avif";
import artist from "@/assets/artist.avif";
import { useTranslations } from "next-intl";
export default function BentoLanding() {
  const t = useTranslations("hero");
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 pb-12">
      {/* Hero Section */}
      <section className="relative bg-orange-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image src={bg} alt="Abstract Art Background" layout="fill" objectFit="cover" className="opacity-20" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="py-24 md:py-32 lg:py-40">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{t("title")}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">{t("subTitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-100">
                {t("exploreGallery")}
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-orange-700">
                {t("meetOurArtist")}
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto mt-10">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Hero Section */}
          <Card className="col-span-full lg:col-span-2 row-span-2 overflow-hidden">
            <CardContent className="p-0 relative h-[400px] md:h-full">
              <Image src={paint2} alt="Featured Artwork" layout="fill" objectFit="cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover Unique Art</h1>
                <p className="mb-4">Find the perfect piece to express your style</p>
                <Button size="lg" className="w-full md:w-auto">
                  Explore Gallery
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Artist */}
          <Card className="col-span-full md:col-span-2 lg:col-span-1 row-span-2">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Featured Artist</h2>
              <Image src={artist} alt="Featured Artist" width={200} height={200} className="rounded-full mx-auto mb-4 aspect-square object-cover" />
              <h3 className="text-xl font-semibold text-center mb-2">Jane Doe</h3>
              <p className="text-gray-600 text-center mb-4">Contemporary artist known for vibrant abstract paintings.</p>
              <Button variant="outline" className="w-full">
                View Collection
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="col-span-full md:col-span-1 lg:col-span-1 row-span-1">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Art Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-orange-700">1,000+</p>
                  <p className="text-sm text-gray-600">Artworks</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-700">500+</p>
                  <p className="text-sm text-gray-600">Artists</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-700">50+</p>
                  <p className="text-sm text-gray-600">Countries</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-700">10k+</p>
                  <p className="text-sm text-gray-600">Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Artwork 1 */}
          <Card className="col-span-1 row-span-1">
            <CardContent className="p-4">
              <div className="relative h-40 mb-2">
                <Image src={paint1} alt="Artwork 1" layout="fill" objectFit="cover" className="rounded-md" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Abstract Harmony</h3>
              <p className="text-sm text-gray-600 mb-2">by John Smith</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">$599</span>
                <Badge>Oil Painting</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Featured Artwork 2 */}
          <Card className="col-span-1 row-span-1">
            <CardContent className="p-4">
              <div className="relative h-40 mb-2">
                <Image src={paint3} alt="Artwork 2" layout="fill" objectFit="cover" className="rounded-md" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Serene Landscape</h3>
              <p className="text-sm text-gray-600 mb-2">by Emma Johnson</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">$799</span>
                <Badge>Watercolor</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial */}
          <Card className="col-span-full md:col-span-2 lg:col-span-1 row-span-1">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <Star className="w-8 h-8 text-yellow-400 mb-4" />
              <blockquote className="text-lg italic mb-4">"ArtSell has transformed how I discover and purchase art. The quality and variety are unmatched!"</blockquote>
              <p className="font-semibold">- Sarah M., Art Collector</p>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="col-span-full row-span-1 bg-orange-700 text-white">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to Find Your Perfect Piece?</h2>
                <p className="mb-4 md:mb-0">Join our community of art lovers today.</p>
              </div>
              <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-100">
                Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="col-span-full md:col-span-4 row-span-1">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Search className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <h3 className="font-semibold mb-1">Discover Art</h3>
                    <p className="text-sm text-gray-600">Explore unique artworks</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Palette className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <h3 className="font-semibold mb-1">Curated Selection</h3>
                    <p className="text-sm text-gray-600">Handpicked by experts</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ShoppingBag className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <h3 className="font-semibold mb-1">Easy Purchase</h3>
                    <p className="text-sm text-gray-600">Secure global shipping</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
