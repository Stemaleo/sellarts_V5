"use client";

import { updateArtistVerification } from "@/actions/artists";
import { Switch } from "@/components/ui/switch";
import { useActions } from "@/lib/hooks";
import { User } from "@/lib/type";

const VerificationSwitch = ({ artist }: { artist: User }) => {
  const { loading, execute } = useActions();

  return (
    <Switch
      defaultChecked={artist.verified}
      onCheckedChange={(c) => {
        execute(updateArtistVerification, artist.id, c ? "yes" : "no");
      }}
    />
  );
};

export default VerificationSwitch;
