﻿// This file was generated by a tool; you should avoid making direct changes.
// Consider using 'partial classes' to extend these types
// Input: my.proto

#pragma warning disable CS1591, CS0612, CS3021, IDE1006
namespace mhcc.app.dataprovider.model.tdiinterface.dstructs
{

    [global::ProtoBuf.ProtoContract()]
    public partial class VersionTdiArray : global::ProtoBuf.IExtensible
    {
        private global::ProtoBuf.IExtension __pbn__extensionData;
        global::ProtoBuf.IExtension global::ProtoBuf.IExtensible.GetExtensionObject(bool createIfMissing)
            => global::ProtoBuf.Extensible.GetExtensionObject(ref __pbn__extensionData, createIfMissing);

        [global::ProtoBuf.ProtoMember(1, Name = @"versionTdiArray")]
        public global::System.Collections.Generic.List<VersionTdi> versionTdiArrays { get; } = new global::System.Collections.Generic.List<VersionTdi>();

    }

}

#pragma warning restore CS1591, CS0612, CS3021, IDE1006
