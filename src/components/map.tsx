"use client"

export default function DealershipMap() {
    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border shadow-md">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.85787287743!2d29.27938651155049!3d37.81679790962125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c719da8b40c017%3A0x27f2963a8708ff54!2sHonaz%20Galericiler%20Sitesi!5e0!3m2!1str!2str!4v1764847639214!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    )
}
