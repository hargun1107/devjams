import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Camera } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const startScanner = async () => {
      try {
        setIsScanning(true);
        setError(null);

        await Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment"
            }
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader"
            ]
          }
        });

        Quagga.start();
      } catch (err) {
        setError("Failed to start camera. Please check permissions.");
        setIsScanning(false);
      }
    };

    startScanner();

    const handleDetected = (result: any) => {
      const code = result.codeResult.code;
      if (code) {
        onScan(code);
        Quagga.stop();
      }
    };

    Quagga.onDetected(handleDetected);

    return () => {
      Quagga.stop();
    };
  }, [onScan]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Scan Barcode
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            ref={scannerRef}
            className="relative w-full h-64 bg-muted rounded-lg overflow-hidden"
          >
            {!isScanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-muted-foreground">Initializing camera...</div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-destructive text-center">{error}</div>
              </div>
            )}
          </div>
          {isScanning && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Point your camera at the barcode
              </p>
              <div className="flex justify-center">
                <div className="animate-pulse w-16 h-16 border-2 border-primary rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin" />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}